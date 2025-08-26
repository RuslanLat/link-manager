import { defineStore } from "pinia";
import { ref } from 'vue'
import type { Tables } from "../database.types.ts";

export const useCategoryStore = defineStore('category', () => {

    const listCategory = ref<Tables<'categories'>[]>([])

    function filterById(id: number) {
        listCategory.value = listCategory.value.filter((category) => category.id !== id)
    }

    return { listCategory, filterById }
})