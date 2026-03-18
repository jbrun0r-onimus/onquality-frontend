<template>
  <div>
    <q-spinner color="white" size="128px" :thickness="2" />
  </div>
</template>

<style scoped lang="scss">
div {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
</style>
