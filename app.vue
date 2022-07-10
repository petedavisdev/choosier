<template>
  <div>
    <Head>
      <Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <Link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <Link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <Link rel="manifest" href="/site.webmanifest" />
      <Link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <Meta name="msapplication-TileColor" content="#2b5797" />
      <Meta name="theme-color" content="#eeeeee" />
    </Head>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
@import './assets/modern-normalize.css';

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-weight: 300;
  font-size: 18px;
  color: #222;
  background-color: #eee;
}

h1 {
  margin-block: 0.25em;
}

h2 {
  font-size: 1.25em;
  margin-block: 0.25em;
}

img {
  height: auto;
  max-width: 100%;
}
</style>
