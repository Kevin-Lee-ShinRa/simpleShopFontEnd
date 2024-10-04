<template>
  <transition name="text-up-transition">
    <slot></slot>
  </transition>
</template>

<style lang="sass">
.text-up-transition
  &-enter
    opacity: 0
    transform: translateY(60%)

  &-enter-to, &-leave
    opacity: 1
    transform: translateY(0)

  &-leave-to
    opacity: 0
    transform: translateY(-60%)

  &-enter-active, &-leave-active
    position: absolute
    transition: all .3s cubic-bezier(0.25, 0.8, 0.5, 1)
</style>
<script setup>
</script>