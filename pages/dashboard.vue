<script lang="ts" setup>
const user = useSupabaseUser()
</script>

<script lang="ts">
const authenticate = async () => {
  const supabase = useSupabaseClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'https://yumi.to/dashboard'
    }
  })
  if (error) {
    console.error(error)
  }
}
</script>

<template lang="pug">
ShortlinkList(v-if="user")
div.flex.flex-col.items-center.justify-center.h-screen(v-if="!user")
  button(@click="authenticate") Authenticte with GitHub
</template>
<style lang="scss">
@import '~/assets/dashboard.scss';
</style>
