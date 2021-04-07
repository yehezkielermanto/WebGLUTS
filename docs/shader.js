 /*=================== SHADERS =================== */

         var vertCode = 'attribute vec3 position;'+
            'uniform mat4 Pmatrix;'+
            'uniform mat4 Vmatrix;'+
            'uniform mat4 Mmatrix;'+
            'attribute vec3 color;'+//the color of the point
            'varying vec3 vColor;'+
            'void main(void) { '+//pre-built function
               'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);'+
               'vColor = color;'+
            '}';

         var fragCode = 'precision mediump float;'+
            'varying vec3 vColor;'+
            'void main(void) {'+
               'gl_FragColor = vec4(vColor, 1.);'+
            '}';

         var vertShader = gl.createShader(gl.VERTEX_SHADER);
         gl.shaderSource(vertShader, vertCode);
         gl.compileShader(vertShader);

         var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
         gl.shaderSource(fragShader, fragCode);
         gl.compileShader(fragShader);

         var shaderprogram = gl.createProgram();
         gl.attachShader(shaderprogram, vertShader);
         gl.attachShader(shaderprogram, fragShader);
         gl.linkProgram(shaderprogram);

         /*======== Associating attributes to vertex shader =====*/
         var _Pmatrix = gl.getUniformLocation(shaderprogram, "Pmatrix");
         var _Vmatrix = gl.getUniformLocation(shaderprogram, "Vmatrix");
         var _Mmatrix = gl.getUniformLocation(shaderprogram, "Mmatrix");

         gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
         var _position = gl.getAttribLocation(shaderprogram, "position");
         gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0);
         gl.enableVertexAttribArray(_position);


         gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
         var _color = gl.getAttribLocation(shaderprogram, "color");
         gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0) ;
         gl.enableVertexAttribArray(_color);
         gl.useProgram(shaderprogram);
 
