import { supabase } from '@/supabase'
import { useRequest } from '@/composables/useRequest'
import type { PostgrestError } from '@supabase/supabase-js'
import type { Tables } from "@/database.types.ts";

export function useCategory() {
    const { loading, errorMessage, handleRequest } = useRequest()

    async function saveCategory(name: string) {
        return handleRequest<Tables<'categories'>[], PostgrestError>(async () => {
            const { data, error } = await supabase
                .from('categories')
                .insert({ name })
                .select()
            if (error) throw error
            return data
        })
    }

    async function getCategory() {
        return handleRequest<Tables<'categories'>[], PostgrestError>(async () => {
            const { data, error } = await supabase.from('categories').select()
            if (error) throw error
            return data
        })
    }

    async function deleteCategory(id: number) {
        const { error } = await supabase.from('categories').delete().eq('id', id)
        if (error) throw error
    }


    return { loading, errorMessage, saveCategory, getCategory, deleteCategory }
}