<script lang="ts" setup>
defineProps<{
  link: {
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
    p {{ link.short }} 
    div.flex
      button.mr-2.text-green-500.p-1.rounded-md(@click="copy(link.short)") Copy
      button.text-gray-400.p-1.rounded-md(@click="startEditing(link.id)") Edit
  p {{ link.link }}
</template>
