import { defineStore } from "pinia";
import { ref } from 'vue'
import { supabase } from "@/supabase";
import type { User } from "@supabase/supabase-js";


export const useUserStore = defineStore('auth', () => {

    const user = ref<User | null>(null)

    async function getUser() {
        const { data } = await supabase.auth.getUser()
        user.value = data?.user
    }

    function resetUser() {
        user.value = null
    }

    return { user, getUser, resetUser }
})