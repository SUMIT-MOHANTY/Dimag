export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  courseCount: number
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  courseCount: number
  createdAt: string
}

export interface CategoryCreatePayload {
  name: string
  description?: string
  parentId?: string
}

export interface TagCreatePayload {
  name: string
}

export interface CategoryTreeItem extends Category {
  children: CategoryTreeItem[]
}
