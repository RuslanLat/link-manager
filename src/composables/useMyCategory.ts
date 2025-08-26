import { supabase } from '@/supabase'
import { useMyRequest } from '@/composables/useMyRequest'
import type { QueryResult } from '@supabase/supabase-js'

export function useMyCategory() {
    const { loading, handleRequest } = useMyRequest()

    async function saveCategory(name: string) {
        const newCategoryQuery = supabase
            .from('categories')
            .insert({ name })
            .select()
        type newCategoryResult = QueryResult<typeof newCategoryQuery>;
        return handleRequest<newCategoryResult>(async () => newCategoryQuery)
    }

    async function getCategory() {
        const categoryQuery = supabase.from('categories').select()
        type categoryQueryResult = QueryResult<typeof categoryQuery>;
        return handleRequest<categoryQueryResult>(async () => categoryQuery)
    }

    async function deleteCategory(id: number) {
        const { error } = await supabase.from('categories').delete().eq('id', id)
        if (error) throw error
    }


    return { loading, saveCategory, getCategory, deleteCategory }
}