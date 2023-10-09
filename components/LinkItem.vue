<script lang="ts" setup>
defineProps<{
  shortlink: {
    id: string
    short: string
    link: string
  }
  copy: (text: string) => void
  startEditing: (id: string) => void
  setQrcode: (bool: boolean, value: string) => void
}>()
</script>

<template lang="pug">
li.flex.justify-between.flex-col
  div.flex.justify-between
    p {{ shortlink.short }} 
    div.flex
      button.mr-2.text-green-500.p-1.rounded-md(@click="copy(shortlink.short)") Copy
      button.mr-2.text-gray-400.p-1.rounded-md(@click="startEditing(shortlink.id)") Edit
      button.p-1.rounded-md(@click="setQrcode(true, shortlink.short)")
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5Zm0 9.75c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5Zm9.75-9.75c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"/><path d="M6.75 6.75h.75v.75h-.75v-.75Zm0 9.75h.75v.75h-.75v-.75Zm9.75-9.75h.75v.75h-.75v-.75Zm-3 6.75h.75v.75h-.75v-.75Zm0 6h.75v.75h-.75v-.75Zm6-6h.75v.75h-.75v-.75Zm0 6h.75v.75h-.75v-.75Zm-3-3h.75v.75h-.75v-.75Z"/></g></svg>
  p {{ shortlink.link }}
</template>
