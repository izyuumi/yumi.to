<script lang="ts" setup>
import useExternalRedirect from '@/composables/useExternalRedirect'
import type Database from '@/types/supabase'

const props = defineProps<{
  destination: string
  short: string
}>()

if (props.destination) {
  useExternalRedirect(props.destination)
} else {
  const { params } = useRoute()
  const supabase = useSupabaseClient<Database>()

  const paramsDepth = Object.keys(params).length

  const short =
    props.short ??
    (() => {
      switch (paramsDepth) {
        case 2:
          return `${params.first}/${params.short}`
        case 3:
          return `${params.first}/${params.second}/${params.short}`
        default:
          return params.short
      }
    })()

  const { data: exactData } = await supabase
    .from('shortlinks')
    .select('*')
    .eq('short', short)
    .maybeSingle()

  if (exactData?.link) {
    useExternalRedirect(exactData.link)
  } else {
    const { data: startsWithData } = await supabase
      .from('shortlinks')
      .select('*')
      .like('short', `${short}%`)
      .maybeSingle()

    if (startsWithData?.link) {
      useExternalRedirect(startsWithData.link)
    } else {
      useExternalRedirect()
    }
  }
}
</script>

<template lang="pug">
div.flex.justify-center.items-center.h-screen.w-screen.bg-black.text-white.text-2xl
  p Redirecting...
</template>
