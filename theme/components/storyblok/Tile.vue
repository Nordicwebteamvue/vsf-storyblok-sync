<script>
import Tile from 'src/modules/vsf-storyblok-module/components/Tile'
export default {
  name: 'TileBlok',
  extends: Tile
}
</script>

<style lang="scss" scoped>
.tile {
  position: relative;
  width: 100%;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  background-size: cover;
  background-color: #691fc5;
  background-blend-mode: overlay;
}

.content {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;
}

h2 {
  text-transform: uppercase;
  padding: 0;
  margin: 0;
}

a {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  display: block;
  height: 30px;
  line-height: 30px;
  text-align: center;
  padding: 10px;
  transition: all .3s;
  border: 2px solid #fff;
  font-size: 1.3em;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #fff;
  overflow: hidden;
  margin: 10px auto;
  max-width: 50%;
}
</style>
