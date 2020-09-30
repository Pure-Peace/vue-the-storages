import {
  createLocal,
  createSession
} from 'the-storages'

const install = (vueObject, vtOptions = {
  localMirrorKey: '$localData',
  localStorageKey: '$local',
  sessionMirrorKey: '$sessionData',
  sessionStorageKey: '$session',
  options: {
    vueModule: null,
    strict: true,
    mirrorOperation: false,
    updateMirror: true
  }
}) => {
  if (!vtOptions) vtOptions = {}

  const isVue3 = typeof vueObject === 'object'
  const {
    localMirrorKey,
    localStorageKey,
    sessionMirrorKey,
    sessionStorageKey,
    options
  } = vtOptions

  const localMirror = createLocal(options)
  const sessionMirror = createSession(options)

  vueObject.mixin({
    created() {
      localMirror.bindVm(this)
      this[localMirrorKey || '$storageData'] = localMirror
      this[localStorageKey || '$storage'] = localMirror._prx

      sessionMirror.bindVm(this)
      this[sessionMirrorKey || '$sessionData'] = sessionMirror
      this[sessionStorageKey || '$session'] = sessionMirror._prx

    },
    [isVue3 ? 'beforeUnmount' : 'beforeDestroy']() {
      localMirror.unbindVm(this)
      sessionMirror.unbindVm(this)
    }
  })
}

export default install