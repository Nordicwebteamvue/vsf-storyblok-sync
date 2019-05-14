<template>
  <div>
    Missing component <strong>{{ item.component }}</strong>
    <pre>{{ item | pretty }}</pre>
  </div>
</template>

<script>
import Blok from './Blok'
export default {
  name: 'DebugBlok',
  extends: Blok
}
</script>
