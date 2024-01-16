import * as itowns from 'itowns';

export function BaseMapLayer(config, extent) {
  return new itowns.ColorLayer(config['name'], {
    updateStrategy: {
      type: app.itowns.STRATEGY_DICHOTOMY,
      options: {},
    },
    source: new itowns.WMSSource({
      extent: extent,
      name: config.source['name'],
      url: config.source['url'],
      version: config.source['version'],
      crs: extent.crs,
      format: config.source['format'],
    }),
    transparent: true,
  });
}

export function ColorLayerFromFile(config, style) {
  return new itowns.ColorLayer(config.id, {
    name: config.id,
    transparent: true,
    source: new itowns.FileSource({
      url: config.url,
      crs: config.crs,
      format: 'application/json',
    }),
    style: new itowns.Style(config.style),
  });
}

export function ElevationLayer(config, extent) {
  return new itowns.ElevationLayer(config['layer_name'], {
    useColorTextureElevation: true,
    colorTextureElevationMinZ: config['colorTextureElevationMinZ'],
    colorTextureElevationMaxZ: config['colorTextureElevationMaxZ'],
    source: new itowns.WMSSource({
      extent: extent,
      url: config['url'],
      name: config['name'],
      crs: extent.crs,
      heightMapWidth: 256,
      format: config['format'],
    }),
  });
}

export function C3DTilesLayer(config, view) {
  return new app.itowns.C3DTilesLayer(
    config['id'],
    {
      name: config['id'],
      source: new app.itowns.C3DTilesSource({
        url: config['url'],
      }),
    },
    view
  );
}
