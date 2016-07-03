/**
 * @constructor
 */
function spinningCubeLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, -50 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  this.camera.position.z = 200;
  this.camera.position.y = 70;

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);

  this.map = Loader.loadTexture('res/wall.jpg');
  this.normalMap = Loader.loadTexture('res/wall_norm.jpg');

  var material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: this.map,
    normalMap: this.normalMap
  });
  material.metalness = 0.1;
  material.roughness = 0.8;
  this.map.wrapS = this.map.wrapT = THREE.RepeatWrapping;
  this.normalMap.wrapS = this.normalMap.wrapT = THREE.RepeatWrapping;

  function createTower(spec) {
    var geometry = new THREE.Geometry();
    var segments = 4;
    var cumulatedHeight = 0;
    geometry.faceVertexUvs[0] = [];
    for(var j = 0; j <= spec.length; j++) {
      var story = spec[j - 1];
      if(j == 0) {
        story = spec[0];
      }
      cumulatedHeight += story.height;
      for(var i = 0; i < segments; i++) {
        geometry.vertices.push(
            new THREE.Vector3(Math.sin(i * Math.PI * 2 / segments) * story.radius,
                              cumulatedHeight,
                              Math.cos(i * Math.PI * 2 / segments) * story.radius));

        if(j > 0 && i < segments - 1) {
          var offset = segments * (j - 1) + i;
          geometry.faces.push(new THREE.Face3(offset + 0,
                                              offset + 1,
                                              offset + segments));
          geometry.faceVertexUvs[0].push([
            new THREE.Vector2(1, 0),
            new THREE.Vector2(0, 0),
            new THREE.Vector2(1, story.height / 10)
          ]);
          geometry.faces.push(new THREE.Face3(offset + segments,
                                              offset + 1,
                                              offset + segments + 1));
          geometry.faceVertexUvs[0].push([
            new THREE.Vector2(1, story.height / 10),
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0, story.height / 10)
          ]);
        }
      }
      if(j > 0) {
        offset = segments * (j - 1);
        geometry.faces.push(new THREE.Face3(offset + segments - 1,
                                            offset + 0,
                                            offset + 2 * segments - 1));
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(1, 0),
          new THREE.Vector2(0, 0),
          new THREE.Vector2(1, story.height / 10)
        ]);
        geometry.faces.push(new THREE.Face3(offset + 2 * segments - 1,
                                            offset + 0,
                                            offset + segments));
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(1, story.height / 10),
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0, story.height / 10)
        ]);
      }
    }
    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    geometry.uvsNeedUpdate = true;
    geometry.computeFaceNormals();
    tower = new THREE.Mesh(geometry, material);
    return tower;
  }

  this.tower = createTower([
    {height: 0, radius: 0},
    {height: 0, radius: 15},
    {height: 20, radius: 15},
    {height: 0, radius: 16},
    {height: 2, radius: 16},
    {height: 0, radius: 15},
    {height: 20, radius: 15},
    {height: 0, radius: 16},
    {height: 2, radius: 16},
    {height: 0, radius: 15},
    {height: 10, radius: 15},
    {height: 3, radius: 20},
    {height: 3, radius: 20},
    {height: 0, radius: 19},
    {height: 4, radius: 19},
    {height: 0, radius: 16},
    {height: -4, radius: 16},
    {height: 0, radius: 10},
    {height: 30, radius: 10},
    {height: 3, radius: 13},
    {height: 6, radius: 13},
    {height: 0, radius: 10},
    {height: -4, radius: 10},
    {height: 0, radius: 8},
    {height: 10, radius: 8},
    {height: 0, radius: 10},
    {height: 2, radius: 10},
    {height: 0, radius: 16},
    {height: 4, radius: 8},
    {height: 24, radius: 0},
  ]);
  this.scene.add(this.tower);
}

spinningCubeLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

spinningCubeLayer.prototype.start = function() {
};

spinningCubeLayer.prototype.end = function() {
};

spinningCubeLayer.prototype.resize = function() {
};

spinningCubeLayer.prototype.update = function(frame, relativeFrame) {
  this.tower.rotation.y = frame / 37 / 2;
  this.camera.position.y = 100 + Math.sin(frame / 47) * 30;
  this.camera.lookAt(new THREE.Vector3(0, 70, 0));
};

spinningCubeLayer.prototype.render = function(renderer, interpolation) {
};
