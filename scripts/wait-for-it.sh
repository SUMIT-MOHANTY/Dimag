#!/usr/bin/env bash
# wait-for-it.sh - Wait for a service to be ready before executing a command
# Usage: wait-for-it.sh host:port [-s] [-t timeout] [-- command args]
#   -s: Strict mode, exit with code 1 if timeout is reached
#   -t: Timeout in seconds (default: 15)

set -e

TIMEOUT=15
STRICT=0
HOST=""
PORT=""
CLI=""

usage() {
    cat << EOF
Usage: $0 host:port [-s] [-t timeout] [-- command args]
Wait for host:port to be available, then execute command.

Options:
    -s          Strict mode: exit with code 1 if timeout reached
    -t TIMEOUT  Timeout in seconds (default: 15)
    -- COMMAND  Command to execute after host:port is available

Examples:
    $0 db:5432 -- echo "Database is ready"
    $0 -t 30 redis:6379 -- ./start-app.sh
EOF
    exit 1
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -s)
            STRICT=1
            shift
            ;;
        -t)
            TIMEOUT="$2"
            shift 2
            ;;
        --)
            shift
            CLI="$@"
            break
            ;;
        -*)
            echo "Unknown option: $1"
            usage
            ;;
        *)
            if [[ -z "$HOST" ]]; then
                HOSTPORT="$1"
                HOST="${HOSTPORT%:*}"
                PORT="${HOSTPORT#*:}"
                if [[ "$HOST" == "$HOSTPORT" ]]; then
                    echo "Error: Port not specified in '$HOSTPORT'"
                    usage
                fi
            else
                echo "Unexpected argument: $1"
                usage
            fi
            shift
            ;;
    esac
done

if [[ -z "$HOST" || -z "$PORT" ]]; then
    echo "Error: host:port is required"
    usage
fi

echo "Waiting for $HOST:$PORT..."

# Wait for the service to be available
wait_for() {
    local start_time=$(date +%s)
    
    while true; do
        # Try to connect using bash built-in
        if (echo > /dev/tcp/$HOST/$PORT) 2>/dev/null; then
            echo "$HOST:$PORT is available!"
            return 0
        fi
        
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))
        
        if [[ $elapsed -ge $TIMEOUT ]]; then
            echo "Timeout waiting for $HOST:$PORT after ${TIMEOUT}s"
            return 1
        fi
        
        sleep 1
    done
}

if wait_for; then
    if [[ -n "$CLI" ]]; then
        echo "Executing: $CLI"
        exec $CLI
    fi
    exit 0
else
    if [[ $STRICT -eq 1 ]]; then
        exit 1
    fi
    # In non-strict mode, still try to execute the command
    if [[ -n "$CLI" ]]; then
        echo "Warning: Timeout reached, but executing command anyway"
        exec $CLI
    fi
    exit 0
fi
