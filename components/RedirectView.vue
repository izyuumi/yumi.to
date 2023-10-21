<script lang="ts" setup>
import useExternalRedirect from '@/composables/useExternalRedirect'
import type Database from '@/types/supabase'

const params = useRoute().params
const supabase = useSupabaseClient<Database>()

const { data: exactData } = await supabase
  .from('shortlinks')
  .select('*')
  .eq('short', params.short)
  .maybeSingle()

if (exactData?.link) {
  useExternalRedirect(exactData.link)
} else {
  const { data: startsWithData } = await supabase
    .from('shortlinks')
    .select('*')
    .like('short', `${params.short}%`)
    .maybeSingle()

  if (startsWithData?.link) {
    useExternalRedirect(startsWithData.link)
  } else {
    useExternalRedirect()
  }
}
useExternalRedirect()
</script>

<template lang="pug">
div.flex.justify-center.items-center.h-screen.w-screen.bg-black.text-white.text-2xl
  p Redirecting...
</template>
