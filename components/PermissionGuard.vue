<template>
  <slot v-if="hasAccess" />
</template>

<script setup lang="ts">
/**
 * PermissionGuard Component
 *
 * Conditionally renders content based on user category.
 * The component hides its slot content if the user's category doesn't match
 * any of the allowed categories.
 *
 * @prop {number | number[]} categories - Single category or array of allowed user categories
 *
 * @example
 * <!-- Single category -->
 * <PermissionGuard :categories="3">
 *   <div>Superadmin only content</div>
 * </PermissionGuard>
 *
 * @example
 * <!-- Multiple categories -->
 * <PermissionGuard :categories="[0, 3, 4]">
 *   <button>Admin Action</button>
 * </PermissionGuard>
 */

interface Props {
  categories: number | number[]
}

const props = defineProps<Props>()

const { hasCategory } = usePermissions()

const hasAccess = computed(() => hasCategory(props.categories))
</script>
