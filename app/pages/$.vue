<script setup lang="ts">
const route = useRoute();
const checkoutId = route.query.checkout_id;
</script>

<template>
    <h1>Success!</h1>
    <p>Checkout ID: {{ checkoutId }}</p>
</template>