<template>
  <section class="carrusel-tienda" :aria-label="ariaLabel">
    <header class="cabecera-carrusel">
      <h2>{{ titulo }}</h2>
      <slot name="acciones"></slot>
    </header>
    <div class="pista-carrusel" role="list" :aria-label="ariaLabel">
      <slot></slot>
    </div>
  </section>
</template>

<script setup>
defineProps({
  titulo: {
    type: String,
    required: true,
  },
  ariaLabel: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.carrusel-tienda {
  margin: 12px 0 0;
}
.cabecera-carrusel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}
.cabecera-carrusel h2 {
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.15;
}
.pista-carrusel {
  display: grid;
  grid-auto-columns: 116px;
  grid-auto-flow: column;
  gap: 10px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  padding: 2px 2px 10px;
  scroll-padding-inline: 2px;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.pista-carrusel::-webkit-scrollbar {
  display: none;
}
.pista-carrusel > :slotted(*) {
  scroll-snap-align: start;
}
@media (min-width: 700px) {
  .pista-carrusel {
    grid-auto-columns: 128px;
  }
}
</style>
