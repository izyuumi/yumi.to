<script lang="ts" setup>
defineProps<{
  shortlink: {
    id: string
    short: string
    link: string
  }
  copy: (text: string) => void
  startEditing: (id: string) => void
}>()
</script>

<template lang="pug">
li.flex.justify-between.flex-col
  div.flex.justify-between
    p {{ shortlink.short }} 
    div.flex
      button.mr-2.text-green-500.p-1.rounded-md(@click="copy(shortlink.short)") Copy
      button.text-gray-400.p-1.rounded-md(@click="startEditing(shortlink.id)") Edit
  p {{ shortlink.link }}
</template>
