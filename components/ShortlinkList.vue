<script setup lang="ts">
import type Database from '@/types/supabase'

interface Shortlink {
  id: string
  short: string
  link: string
}

const emptyShortlink: Shortlink = {
  id: '',
  short: '',
  link: ''
}

const { data } = useAsyncData(async () => {
  const supabase = useSupabaseClient<Database>()
  const { data } = await supabase
    .from('shortlinks')
    .select('*')
    .order('created_at', { ascending: false })
  return data
})

const links = ref(data.value)

const copy = (text: string) => {
  const domain = window.location.origin
  navigator.clipboard.writeText(`${domain}/${text}`)
}

const editing = ref(false)
const editingShortlink = ref<Shortlink>(emptyShortlink)
const setEditing = (value: boolean) => {
  editing.value = value
  if (!value) {
    editingShortlink.value = emptyShortlink
  }
}
const startEditing = (id: string) => {
  setEditing(true)
  if (!links.value) return
  const shortlink = links.value.find(link => link.id === id)
  if (shortlink) {
    editingShortlink.value = shortlink
  }
}
const save = async () => {
  const supabase = useSupabaseClient<Database>()
  const { data } = await supabase
    .from('shortlinks')
    .update({
      short: editingShortlink.value.short,
      link: editingShortlink.value.link
    })
    .match({ id: editingShortlink.value.id })
    .select('*')
    .single()
  if (!links.value || !data) return
  links.value = links.value.map(link => {
    if (link.id === data.id) {
      return data
    }
    return link
  })
  setEditing(false)
}
const deleteShortlink = async () => {
  const supabase = useSupabaseClient<Database>()
  await supabase
    .from('shortlinks')
    .delete()
    .match({ id: editingShortlink.value.id })
  if (!links.value) return
  links.value = links.value.filter(
    link => link.id !== editingShortlink.value.id
  )
  setEditing(false)
}
</script>

<template lang="pug">
main.w-full.h-screen.flex.items-center.flex-col
  h1 Shortlinks
  div
    ul
      LinkItem(v-for="link in links" :link="link" :key="link.short" :copy="copy" :startEditing="startEditing")
  ClientOnly
    HeadlessDialog(:open="editing" @close="setEditing").fixed.top-0.left-0.right-0.bottom-0.flex.justify-center.items-center
      div(class="fixed inset-0 bg-black/30")
      div(class="fixed inset-0 flex w-screen items-center justify-center p-4")
        HeadlessDialogPanel.rounded-md.p-4.bg-zinc-800
          HeadlessDialogTitle Edit Shortlink
          div.py-1
            label(for="short") Short
            input(type="text" v-model="editingShortlink.short" class="w-full rounded-md p-2 bg-zinc-700 text-white")
          div.py-1
            label(for="link") Link
            textarea(type="text" v-model="editingShortlink.link" class="w-full rounded-md p-2 bg-zinc-700 text-white")
          div.flex.justify-end
            button.mr-2.text-gray-400.p-1.rounded-md(@click="setEditing(false)") Cancel
            button.mr-2.text-red-500.p-1.rounded-md(@click="deleteShortlink") Delete
            button.text-green-500.p-1.rounded-md(@click="save") Save
</template>
