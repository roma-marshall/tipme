<template>
  <client-only>
    <div class="min-h-screen flex flex-col bg-gray-950 text-white font-sans">
      <!-- ===== Header ===== -->
      <header class="flex justify-between items-center px-8 py-4 border-b border-gray-800">
        <h1
            class="text-xl font-semibold cursor-pointer hover:text-emerald-400 transition"
            @click="$router.push('/')"
        >
          tipme.app
        </h1>

        <!-- Wallet connect button -->
        <appkit-button label="Connect Wallet" />
      </header>

      <!-- ===== Page Content ===== -->
      <main class="flex-1">
        <NuxtPage />
      </main>

      <!-- ===== Footer ===== -->
      <footer class="text-center text-xs text-gray-500 py-6 border-t border-gray-800">
        © 2025 Vires Labs – built with 💚 on EVM
      </footer>
    </div>
  </client-only>
</template>

<script setup lang="ts">
// Здесь можно будет добавить глобальные хуки при необходимости
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  background-color: #0a0a0a;
  font-family: 'Inter', sans-serif;
}
</style>
