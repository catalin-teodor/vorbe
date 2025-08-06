function getComponentResources(ctx: BuildCtx): ComponentResources {
  try {
    const allComponents: Set<QuartzComponent> = new Set()
    for (const emitter of ctx.cfg.plugins.emitters) {
      const components = emitter.getQuartzComponents?.(ctx) ?? []
      for (const component of components) {
        allComponents.add(component)
      }
    }

    const componentResources = {
      css: new Set<string>(),
      beforeDOMLoaded: new Set<string>(),
      afterDOMLoaded: new Set<string>(),
    }

    function normalizeResource(resource: string | string[] | undefined): string[] {
      if (!resource) return []
      if (Array.isArray(resource)) return resource
      return [resource]
    }

    for (const component of allComponents) {
      const { css, beforeDOMLoaded, afterDOMLoaded } = component

      normalizeResource(css).forEach((c) => componentResources.css.add(c))
      normalizeResource(beforeDOMLoaded).forEach((b) => componentResources.beforeDOMLoaded.add(b))
      normalizeResource(afterDOMLoaded).forEach((a) => componentResources.afterDOMLoaded.add(a))
    }

    return {
      css: [...componentResources.css],
      beforeDOMLoaded: [...componentResources.beforeDOMLoaded],
      afterDOMLoaded: [...componentResources.afterDOMLoaded],
    }
  } catch (e) {
    console.warn("⚠️ getComponentResources error:", e)

    return {
      css: [],
      beforeDOMLoaded: [],
      afterDOMLoaded: [],
    }
  }
}