<template>
<div id="app">
  <div style="position: fixed; top: 50%; left: 50%; margin-top: -74px; margin-left: -64px; text-align: center;">
    <img src="../../../assets/Stop256.png" style="width: 128px; "></div>
  <div style="height: 40px; width: 100%; position: fixed; top: 50%; margin-top: 64px; text-align: center;">{{Message}}</div>
</div>
</template>

<script>
export default {
  props: {
    post: {
      Message: ''
    }
  },
  data() {
    return {
      Message: 'Sorry! You have Not Authorized to View This Page.'
    }
  }
}
</script>
