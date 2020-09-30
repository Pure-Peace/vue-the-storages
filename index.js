import { createLocal } from 'the-storages'

const mirror = createLocal()

const install = (vueObject, options = {
  mirrorKey: '$storageData',
  storageKey: '$storage'
}) => {
  if (!options) options = {}

  const isVue3 = typeof vueObject === 'object'
  const { mirrorKey, storageKey } = options

  vueObject.mixin({
    created () {
      mirror.bindVm(this)
      this[mirrorKey || '$storageData'] = mirror
      this[storageKey || '$storage'] = mirror._prx
    },
    [isVue3 ? 'beforeUnmount' : 'beforeDestroy'] () {
      mirror.unbindVm(this)
    }
  })
}

export default install
