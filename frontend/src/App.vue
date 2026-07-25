<script setup></script>

<template>
  <div class="app">
    <router-view />

    <section class="contact">
      <p class="contact-name">Carlos Osia</p>
      <p class="contact-role">Fullstack Developer</p>
      <p class="contact-line">
        <a href="tel:+573116665370">3116665370</a>
        <span class="sep">-</span>
        <a href="mailto:carlos.osia1@gmail.com">carlos.osia1@gmail.com</a>
      </p>
      <p class="contact-line">
        <a href="https://github.com/CarlosOsia1/tidelit" target="_blank" rel="noreferrer">
          github.com/CarlosOsia1/tidelit
        </a>
      </p>
    </section>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.contact {
  margin-top: auto;
  padding: 28px 20px;
  text-align: center;
  border-top: 1px solid #e3e6ea;
  color: #6b7280;
  font-size: 0.9rem;
}

.contact-name {
  margin: 0;
  font-weight: 600;
  color: #1f2933;
}

.contact-role {
  margin: 2px 0 8px;
}

.contact-line {
  margin: 2px 0;
}

.contact-line a {
  color: #2c6cf5;
  text-decoration: none;
}

.sep {
  margin: 0 6px;
  color: #cbd2d9;
}
</style>
