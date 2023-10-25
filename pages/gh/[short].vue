<script lang="ts" setup>
import z from "zod";
import { useRoute } from "vue-router";

const { params } = useRoute();
const shortIsString = z.string().safeParse(params.short);
if (!shortIsString.success) {
	throw new Error("Shortlink is not a string");
}
const short = shortIsString.data;

useExternalRedirect(`https://github.com/izyumidev/${short}`);
</script>

<template lang="pug">
div.flex.justify-center.items-center.h-screen.w-screen.bg-black.text-white.text-2xl
	p Redirecting...
</template>
