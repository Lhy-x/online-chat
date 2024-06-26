<script setup>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "/src/components/navbar.vue";
import UserOnline from "/src/components/onlineuser.vue";
</script>

<template>
   <div>
    <Navbar />
    <UserOnline/>
</div>
</template>
