<script lang="ts" setup>
import useExternalRedirect from '@/composables/useExternalRedirect'
import type Database from '@/types/supabase'

const params = useRoute().params
const supabase = useSupabaseClient<Database>()

const { data } = await supabase
  .from('shortlinks')
  .select('*')
  .like('short', `${params.short}%`)
  .maybeSingle()

if (data?.link) {
  useExternalRedirect(data.link)
} else {
  useExternalRedirect()
}
</script>

<template lang="pug">
div.flex.justify-center.items-center.h-screen.w-screen.bg-black.text-white.text-2xl
  p Redirecting...
</template>
