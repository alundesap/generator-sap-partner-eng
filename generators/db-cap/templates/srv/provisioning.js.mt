module.exports = (service) => {
  service.on('UPDATE', 'tenant', async (req, next) => {
    const res = await next();     // first call default implementation which is doing the HDI container creation
    let url = '<%= app_name %>-${space}-dev.<%= domain_name %>/admin';
    console.log('[INFO ][ON_UPDATE_TENANT] ' + 'Application URL is ' + url);
    return url;
  } );
}
