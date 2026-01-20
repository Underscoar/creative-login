<template>
    <g
        id="mouths"
        class="mouths-wrap"
        :class="{
            'surprised-state': characterState === 'curious',
            'sad-state': characterState === 'sad' || characterState === 'nervous'
        }"
    >
        <path class="mouth-shape" :d="computedSurprisedMouth" :class="{ 'hidden': characterState !== 'curious' }" />
        <path class="mouth-shape" :d="computedSmileMouth" :class="{ 'hidden': characterState !== 'idle' }" />
        <path class="mouth-shape" :d="computedSmileSad" :class="{ 'hidden': characterState !== 'sad' && characterState !== 'nervous' }" />
    </g>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useCharacterStore } from '@/stores/useCharacterStore'
import { storeToRefs } from 'pinia'

const characterStore = useCharacterStore()
const { characterState } = storeToRefs(characterStore)

const surprisedMouthHeight = ref(3)

const computedSurprisedMouth = computed(() => `M15-10H7V${surprisedMouthHeight.value}0h8`)
const computedSmileMouth = computed(() => 'M20.8,0C14.7,1.2,8,1.2,2,0L0,6.8c7.3,1.5,15.4,1.5,22.7,0')
const computedSmileSad = computed(() => 'M28.7,2.2C20.2-8.1,1.9-8.4-5.7,2.5L-1,7.9C3.8.3,18.3-.2,24.4,7.9')
</script>

<style lang="scss" scoped>
.mouth-shape {
    fill: #1b1d21;
    transition: transform 0.3s, opacity 0.3s;
    transform-origin: 10px 10px;

    &.hidden {
        transform: scale(0);
        opacity: 0;
    }
}

.mouths-wrap {
    transition: transform 0.3s;
    transform: translate(11px,15px);

    &.surprised-state {
        transform: translate(11px,4px);
    }

    &.sad-state {
        transform: translate(11px,20px);
    }
}
</style>
