// ESLint config generated by Nuxt
/// <reference path="./eslint-typegen.d.ts" />

import { composer } from '../node_modules/eslint-flat-config-utils/dist/index.mjs';
import typegen from '../node_modules/eslint-typegen/dist/index.mjs';
import { createConfigForNuxt, defineFlatConfigs, resolveOptions } from '../node_modules/@nuxt/eslint-config/dist/flat.mjs';

export { defineFlatConfigs }

export const configs = composer()

export const options = resolveOptions({
  "features": {
    "standalone": true
  },
  "dirs": {
    "pages": [
      "pages"
    ],
    "composables": [
      "composables",
      "utils"
    ],
    "components": [
      "components"
    ],
    "componentsPrefixed": [],
    "layouts": [
      "layouts"
    ],
    "plugins": [
      "plugins"
    ],
    "middleware": [
      "middleware"
    ],
    "modules": [
      "modules"
    ],
    "servers": [],
    "root": [
      "/Users/Pete/GitHub/choosier"
    ],
    "src": [
      ""
    ]
  }
})

configs.append(
// Nuxt Configs
createConfigForNuxt(options),

// Set globals from imports registry
{"name":"nuxt/import-globals","languageOptions":{"globals":{"useConsentScriptTrigger":"readonly","useAnalyticsPageEvent":"readonly","useElementScriptTrigger":"readonly","useScript":"readonly","useScriptGoogleAnalytics":"readonly","useScriptPlausibleAnalytics":"readonly","useScriptClarity":"readonly","useScriptCloudflareWebAnalytics":"readonly","useScriptFathomAnalytics":"readonly","useScriptMatomoAnalytics":"readonly","useScriptGoogleTagManager":"readonly","useScriptGoogleAdsense":"readonly","useScriptSegment":"readonly","useScriptMetaPixel":"readonly","useScriptXPixel":"readonly","useScriptIntercom":"readonly","useScriptHotjar":"readonly","useScriptStripe":"readonly","useScriptLemonSqueezy":"readonly","useScriptVimeoPlayer":"readonly","useScriptYouTubePlayer":"readonly","useScriptGoogleMaps":"readonly","useScriptNpm":"readonly","isVue2":"readonly","isVue3":"readonly","defineNuxtLink":"readonly","useNuxtApp":"readonly","tryUseNuxtApp":"readonly","defineNuxtPlugin":"readonly","definePayloadPlugin":"readonly","useRuntimeConfig":"readonly","defineAppConfig":"readonly","requestIdleCallback":"readonly","cancelIdleCallback":"readonly","setInterval":"readonly","useAppConfig":"readonly","updateAppConfig":"readonly","defineNuxtComponent":"readonly","useAsyncData":"readonly","useLazyAsyncData":"readonly","useNuxtData":"readonly","refreshNuxtData":"readonly","clearNuxtData":"readonly","useHydration":"readonly","callOnce":"readonly","useState":"readonly","clearNuxtState":"readonly","clearError":"readonly","createError":"readonly","isNuxtError":"readonly","showError":"readonly","useError":"readonly","useFetch":"readonly","useLazyFetch":"readonly","useCookie":"readonly","refreshCookie":"readonly","onPrehydrate":"readonly","prerenderRoutes":"readonly","useRequestHeader":"readonly","useRequestHeaders":"readonly","useRequestEvent":"readonly","useRequestFetch":"readonly","setResponseStatus":"readonly","onNuxtReady":"readonly","preloadComponents":"readonly","prefetchComponents":"readonly","preloadRouteComponents":"readonly","abortNavigation":"readonly","addRouteMiddleware":"readonly","defineNuxtRouteMiddleware":"readonly","setPageLayout":"readonly","navigateTo":"readonly","useRoute":"readonly","useRouter":"readonly","isPrerendered":"readonly","loadPayload":"readonly","preloadPayload":"readonly","definePayloadReducer":"readonly","definePayloadReviver":"readonly","useLoadingIndicator":"readonly","getAppManifest":"readonly","getRouteRules":"readonly","reloadNuxtApp":"readonly","useRequestURL":"readonly","usePreviewMode":"readonly","useId":"readonly","useRouteAnnouncer":"readonly","onBeforeRouteLeave":"readonly","onBeforeRouteUpdate":"readonly","withCtx":"readonly","withDirectives":"readonly","withKeys":"readonly","withMemo":"readonly","withModifiers":"readonly","withScopeId":"readonly","onActivated":"readonly","onBeforeMount":"readonly","onBeforeUnmount":"readonly","onBeforeUpdate":"readonly","onDeactivated":"readonly","onErrorCaptured":"readonly","onMounted":"readonly","onRenderTracked":"readonly","onRenderTriggered":"readonly","onServerPrefetch":"readonly","onUnmounted":"readonly","onUpdated":"readonly","computed":"readonly","customRef":"readonly","isProxy":"readonly","isReactive":"readonly","isReadonly":"readonly","isRef":"readonly","markRaw":"readonly","proxyRefs":"readonly","reactive":"readonly","readonly":"readonly","ref":"readonly","shallowReactive":"readonly","shallowReadonly":"readonly","shallowRef":"readonly","toRaw":"readonly","toRef":"readonly","toRefs":"readonly","triggerRef":"readonly","unref":"readonly","watch":"readonly","watchEffect":"readonly","watchPostEffect":"readonly","watchSyncEffect":"readonly","isShallow":"readonly","effect":"readonly","effectScope":"readonly","getCurrentScope":"readonly","onScopeDispose":"readonly","defineComponent":"readonly","defineAsyncComponent":"readonly","resolveComponent":"readonly","getCurrentInstance":"readonly","h":"readonly","inject":"readonly","hasInjectionContext":"readonly","nextTick":"readonly","provide":"readonly","defineModel":"readonly","defineOptions":"readonly","defineSlots":"readonly","mergeModels":"readonly","toValue":"readonly","useModel":"readonly","useAttrs":"readonly","useCssModule":"readonly","useCssVars":"readonly","useSlots":"readonly","useTransitionState":"readonly","Component":"readonly","ComponentPublicInstance":"readonly","ComputedRef":"readonly","ExtractPropTypes":"readonly","ExtractPublicPropTypes":"readonly","InjectionKey":"readonly","PropType":"readonly","Ref":"readonly","MaybeRef":"readonly","MaybeRefOrGetter":"readonly","VNode":"readonly","injectHead":"readonly","useHead":"readonly","useSeoMeta":"readonly","useHeadSafe":"readonly","useServerHead":"readonly","useServerSeoMeta":"readonly","useServerHeadSafe":"readonly","useChoice":"readonly","Vote":"readonly","Choice":"readonly","useCover":"readonly","useFilteredChoices":"readonly","useProfile":"readonly","PATHS":"readonly","MIN_IMAGES":"readonly","MAX_IMAGES":"readonly","CATEGORIES":"readonly","VISIBILITIES":"readonly","Json":"readonly","Database":"readonly","Tables":"readonly","TablesInsert":"readonly","TablesUpdate":"readonly","Enums":"readonly","addDaysToISODate":"readonly","longDateText":"readonly","shortDateText":"readonly","shuffle":"readonly","windowHeightFix":"readonly","useSupabaseClient":"readonly","useSupabaseSession":"readonly","useSupabaseUser":"readonly","useImage":"readonly","useNuxtDevTools":"readonly","definePageMeta":"readonly","useLink":"readonly"}}}
)

export function withNuxt(...customs) {
  return configs
    .clone()
    .append(...customs)
    .onResolved(configs => typegen(configs, { dtsPath: new URL("./eslint-typegen.d.ts", import.meta.url), augmentFlatConfigUtils: true }))
}

export default withNuxt