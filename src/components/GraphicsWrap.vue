<template>
    <div class="graphics-wrap">
        <CharacterPurple :mouse-position="mousePosition" />
        <CharacterBlack is-base :mouse-position="mousePosition" />
        <CharacterOrange :mouse-position="mousePosition" />
    </div>
</template>

<script lang="ts" setup>
import CharacterBlack from './characters/CharacterBlack.vue'
import CharacterPurple from './characters/CharacterPurple.vue'
import CharacterOrange from './characters/CharacterOrange.vue'

const props = defineProps<{
    mousePosition: {
        x: number
        y: number
    } | null
}>()
</script>

<style lang="scss" scoped>
.graphics-wrap {
    width: 660px;
    flex-shrink: 0;
}
</style>
