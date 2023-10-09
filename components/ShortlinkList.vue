<script lang="ts" setup>
import type Database from '@/types/supabase'

const emptyShortlink: Shortlink = {
  id: '',
  short: '',
  link: ''
}

const query = ref('')

const supabase = useSupabaseClient<Database>()
const { data } = await supabase
  .from('shortlinks')
  .select('*')
  .order('created_at', { ascending: false })

const shortlinks = ref(data)

const search = () => {
  if (query.value.length > 0 && shortlinks.value && data) {
    shortlinks.value = data.filter(
      link =>
        link.short.includes(query.value) || link.link.includes(query.value)
    )
  } else {
    shortlinks.value = data
  }
}

const copy = (text: string) => {
  navigator.clipboard.writeText(`${window.location.origin}/${text}`)
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
  if (!shortlinks.value) return
  const shortlink = shortlinks.value.find(link => link.id === id)
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
  if (!shortlinks.value || !data) return
  shortlinks.value = shortlinks.value.map(link => {
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
  if (!shortlinks.value) return
  shortlinks.value = shortlinks.value.filter(
    link => link.id !== editingShortlink.value.id
  )
  setEditing(false)
}

const creating = ref(false)
const startCreating = () => {
  creating.value = true
}
const createShort = ref('')
const createLink = ref('')
const cancelCreate = () => {
  creating.value = false
  createShort.value = ''
  createLink.value = ''
}
const saveCreate = async () => {
  const supabase = useSupabaseClient<Database>()
  const { data } = await supabase
    .from('shortlinks')
    .insert({
      short: createShort.value,
      link: createLink.value
    })
    .select('*')
    .single()
  if (data && shortlinks.value) {
    shortlinks.value = [data, ...shortlinks.value]
  }
  cancelCreate()
}
</script>

<script lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'

export default {
  mounted() {
    ;(this.$refs['search'] as HTMLInputElement).focus()
  }
}

let domain = ''
if (typeof window !== 'undefined') {
  domain = window.location.origin
}
const qrcode = ref(false)
let qrcodeValue = ''
let qrcodeImage = useQRCode(`${domain}/${qrcodeValue}`)
const setQrcode = (bool: boolean, value?: string) => {
  qrcode.value = bool
  if (!bool || !value) {
    qrcodeValue = ''
  } else {
    qrcodeValue = value
    qrcodeImage = useQRCode(`${domain}/${qrcodeValue}`)
  }
}
</script>

<template lang="pug">
main.w-full.h-screen.flex.items-center.flex-col
  h1 Shortlinks
  div#search.mb-3
    input(type="text" ref="search" v-model="query" @input="search" class="w-full rounded-md p-3 bg-zinc-700 text-white" placeholder="Search")
  div
    ul
      li
        button.text-green-500.p-1.w-full.rounded-md(@click="startCreating" v-if="!creating") Create Shortlink
        form(@submit.prevent="addShortlink" v-if="creating")
          input(type="text" v-model="createShort" class="w-full rounded-md p-2 bg-zinc-700 text-white" placeholder="Short")
          textarea(type="text" v-model="createLink" class="w-full rounded-md p-2 bg-zinc-700 text-white mt-2" placeholder="Long Link")
          div.flex.flex-row.justify-center
            button.text-gray-400.p-1.rounded-md(@click="cancelCreate") Cancel
            button.text-green-500.p-1.rounded-md(@click="saveCreate") Add Shortlink
      LinkItem(v-for="shortlink in shortlinks" :shortlink="shortlink" :key="shortlink.short" :copy="copy" :startEditing="startEditing" :setQrcode="setQrcode")
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

  ClientOnly
    HeadlessDialog(:open="qrcode" @close="setQrcode").fixed.top-0.left-0.right-0.bottom-0.flex.justify-center.items-center
      div(class="fixed inset-0 bg-black/30")
      div(class="fixed inset-0 flex w-screen items-center justify-center p-4")
        HeadlessDialogPanel.rounded-md.p-4.bg-zinc-800
          HeadlessDialogTitle {{ `${domain}/${qrcodeValue}` }}
          div.py-2.flex.justify-center.w-full
            img(:src="qrcodeImage" alt="QR Code")
</template>
