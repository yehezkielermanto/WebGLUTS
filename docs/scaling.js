function showValue(){
            var ukuran = document.getElementById("size").value;
            if (ukuran == 1){
              var b = 1;        

            }else if (ukuran == -0.5){
               var b = -0.5;
            }else if(ukuran == 1.5){
               var b = 1.5;
            }
            else{
               var b = 0;
            }
         
      
         /*============= Creating a canvas ======================*/
         var canvas = document.getElementById('my_Canvas');
         gl = canvas.getContext('experimental-webgl');

         /*========== Defining and storing the geometry ==========*/
         var a = b;
         var vertices = [
            -1+a,-1+a,-1+a, 1+a,-1+a,-1+a, 1+a, 1+a,-1+a, -1+a, 1+a,-1+a,  //belakang
            -1+a,-1+a, 1+a, 1+a,-1+a, 1+a, 1+a, 1+a, 1+a, -1+a, 1+a, 1+a,  // depan
            -1+a,-1+a,-1+a, -1+a, 1+a,-1+a, -1+a, 1+a, 1+a, -1+a,-1+a, 1+a, //kiri
            1+a,-1+a,-1+a, 1+a, 1+a,-1+a, 1+a, 1+a, 1+a, 1+a,-1+a, 1+a,     // kanan
            -1+a,-1+a,-1+a, -1+a,-1+a, 1+a, 1+a,-1+a, 1+a, 1+a,-1+a,-1+a,   // bawah
            -1+a, 1+a, -1+a,  -1+a, 2+a, 0+a,   1+a, 2+a, 0+a,   1+a, 1+a, -1+a,    // atas1
            1+a, 1+a, 1+a,  1+a, 2+a, 0+a,   -1+a, 2+a, 0+a,   -1+a, 1+a, 1+a,   // atas2
            
         ];

         var colors = [
            5,3,7, 5,3,7, 5,3,7, 5,3,7,
            1,1,3, 1,1,3, 1,1,3, 1,1,3,
            2,2,1, 0,0,1, 0,0,1, 0,0,1,
            1,0,0, 1,1,0, 1,2,0, 1,1,0,
            1,1,0, 1,1,0, 1,1,0, 1,1,0,
            0,1,0, 0,1,0, 0,1,0, 0,1,0,
            0,3,7, 0,3,7, 0,3,7, 0,3,7,

         ];

         var indices = [
            0,1,2, 0,2,3, 4,5,6, 4,6,7,
            8,9,10, 8,10,11, 12,13,14, 12,14,15,
            16,17,18, 16,18,19, 20,21,22, 20,22,23,
            20,22,23, 24,25,26, 26,27,20, 10,24,26
         ];

         // Create and store data into vertex buffer
         var vertex_buffer = gl.createBuffer ();
         gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

         // Create and store data into color buffer
         var color_buffer = gl.createBuffer ();
         gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

         // Create and store data into index buffer
         var index_buffer = gl.createBuffer ();
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
         gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

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

         /*==================== MATRIX ====================== */

         function get_projection(angle, a, zMin, zMax) {
            var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
            return [
               0.5/ang, 0 , 0, 0,
               0, 0.5*a/ang, 0, 0,
               0, 0, -(zMax+zMin)/(zMax-zMin), -1,
               0, 0, (-2*zMax*zMin)/(zMax-zMin), 0 
			   ];
         }

         var proj_matrix = get_projection(40, canvas.width/canvas.height, 1, 100);
         var mo_matrix = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];
         var view_matrix = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];

         view_matrix[14] = view_matrix[14]-6;

         /*================= Mouse events ======================*/

         var AMORTIZATION = 0.95;
         var drag = false;
         var old_x, old_y;
         var dX = 0, dY = 0;

         var mouseDown = function(e) {
            drag = true;
            old_x = e.pageX, old_y = e.pageY;
            e.preventDefault();
            return false;
         };

         var mouseUp = function(e){
            drag = false;
         };

         var mouseMove = function(e) {
            if (!drag) return false;
            dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
            dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
            THETA+= dX;
            PHI+=dY;
            old_x = e.pageX, old_y = e.pageY;
            e.preventDefault();
         };

         canvas.addEventListener("mousedown", mouseDown, false);
         canvas.addEventListener("mouseup", mouseUp, false);
         canvas.addEventListener("mouseout", mouseUp, false);
         canvas.addEventListener("mousemove", mouseMove, false);

        

         /*=================== Drawing =================== */

         var THETA = 0,
         PHI = 0;
         var time_old = 0;

         var animate = function(time) {
            var dt = time-time_old;

            if (!drag) {
               dX *= AMORTIZATION, dY*=AMORTIZATION;
               THETA+=dX, PHI+=dY;
            }

            //set model matrix to I4

            mo_matrix[0] = 1, mo_matrix[1] = 0, mo_matrix[2] = 0,
            mo_matrix[3] = 0,

            mo_matrix[4] = 0, mo_matrix[5] = 1, mo_matrix[6] = 0,
            mo_matrix[7] = 0,

            mo_matrix[8] = 0, mo_matrix[9] = 0, mo_matrix[10] = 1,
            mo_matrix[11] = 0,

            mo_matrix[12] = 0, mo_matrix[13] = 0, mo_matrix[14] = 0,
            mo_matrix[15] = 1;

            rotateY(mo_matrix, THETA);
            rotateX(mo_matrix, PHI);

            time_old = time; 
            gl.enable(gl.DEPTH_TEST);

            // gl.depthFunc(gl.LEQUAL);

            gl.clearColor(0.5, 0.5, 0.5, 0.9);
            gl.clearDepth(1.0);
            gl.viewport(0.0, 0.0, canvas.width, canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.uniformMatrix4fv(_Pmatrix, false, proj_matrix);
            gl.uniformMatrix4fv(_Vmatrix, false, view_matrix);
            gl.uniformMatrix4fv(_Mmatrix, false, mo_matrix);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

            window.requestAnimationFrame(animate);
         }
         animate(0);
      } 
 
