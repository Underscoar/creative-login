<template>
    <div class="login-form-wrap">
        <div class="login-form-content">
            <button @click="emit('skew')">
                SKEW
            </button>
            <button @click="emit('gek')">
                DOe gek
            </button>
            <button @click="emit('idle')">
                reset
            </button>

            <div>
                {{ mousePosition?.x || 'null' }},
                {{ mousePosition?.y || 'null' }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
    (e: 'skew'): void
    (e: 'gek'): void
    (e: 'idle'): void
}>()

const props = defineProps<{
    mousePosition: {
        x: number
        y: number
    } | null
}>()
</script>

<style lang="scss" scoped>
.login-form-wrap {
    padding: 0.5rem;
    padding-left: 0;
    flex-grow: 1;

    .login-form-content {
        background: #fff;
        border-radius: 15px;
        height: 100%;
    }
}
</style>
