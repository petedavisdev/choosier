<template>
  <div>
    <Head>
      <Title>Choosier. Visual decisions made easy</Title>
      <Meta name="description" content="Too many options? Use Choosier to create an image poll. Collect votes from friends, colleagues and customers. Perfect for art, design, fashion and photography." />

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
  color: #222;
  background-color: #eee;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 300;
}

img {
  height: auto;
  max-width: 100%;
}

.sr-only:not(:focus):not(:active) {
  clip: rect(0 0 0 0); 
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap; 
  width: 1px;
}
</style>
