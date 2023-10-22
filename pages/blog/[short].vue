<script lang="ts" setup>
import z from 'zod'
import { useRoute } from 'vue-router'

const DictionarySchema = z.record(z.string())
type Dictionary = z.infer<typeof DictionarySchema>

const { params } = useRoute()
const shortIsString = z.string().safeParse(params.short)
if (!shortIsString.success) {
  throw new Error('Shortlink is not a string')
}
const short = shortIsString.data

const fetchAndRedirect = async () => {
  const baseUrl = 'https://yumiizumi.com/blog/'
  const dictionary: Dictionary = await fetch(`${baseUrl}dictionary.json`)
    .then(res => res.json())
    .then(res => DictionarySchema.parse(res))
  const link = dictionary[short]
  if (link) {
    useExternalRedirect(`${baseUrl}${link}`)
  } else {
    useExternalRedirect()
  }
}
fetchAndRedirect()
</script>

<template lang="pug">
div.flex.justify-center.items-center.h-screen.w-screen.bg-black.text-white.text-2xl
  p Redirecting...
</template>
