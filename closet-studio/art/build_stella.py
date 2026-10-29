"""Create an original stylized Stella mesh and deform rig in Blender. Reference is visual only."""
import bpy, math, os
from mathutils import Vector
from math import sin,cos,pi
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def mat(name,color,rough=.55):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*color,1);bs.inputs['Roughness'].default_value=rough
 if name=='Skin':bs.inputs['Subsurface Weight'].default_value=.1
 return m
skin=mat('Skin',(.72,.43,.29),.6);white=mat('Soft ivory cotton',(.91,.90,.86),.85)
hair=mat('Honey blonde',(.43,.28,.105),.55);highlight=mat('Golden strands',(.65,.46,.22),.52)
eyeWhite=mat('Warm eye white',(.9,.92,.90),.25);iris=mat('Cornflower blue',(.055,.26,.43),.3);pupil=mat('Pupils',(.008,.018,.025),.25)
lips=mat('Rose lips',(.49,.20,.17),.7);brow=mat('Soft brows',(.26,.16,.07),.9);earmat=mat('Ear warmth',(.57,.28,.22),.8)
objects=[];weights={}
def finish(o,name,m,bone='Chest'):
 o.name=name;o.data.materials.append(m)
 if o.type=='MESH':
  for p in o.data.polygons:p.use_smooth=True
  objects.append(o);weights[o.name]=bone
 return o
def sphere(name,loc,scale,m,bone='Chest',segments=24,rings=16):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=loc);o=bpy.context.object;o.scale=scale
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 return finish(o,name,m,bone)
def loft(name,rings,m,bone='Chest',segments=32):
 verts=[];faces=[]
 for cx,cy,z,rx,ry in rings:
  for i in range(segments):a=i*2*pi/segments;verts.append((cx+rx*cos(a),cy+ry*sin(a),z))
 for j in range(len(rings)-1):
  for i in range(segments):k=j*segments+i;n=j*segments+(i+1)%segments;faces.append((k,n,n+segments,k+segments))
 faces.append(tuple(range(segments-1,-1,-1)));faces.append(tuple((len(rings)-1)*segments+i for i in range(segments)))
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update();o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o)
 sub=o.modifiers.new('Soft sculpted surface','SUBSURF');sub.levels=2;sub.render_levels=2
 bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.modifier_apply(modifier=sub.name);o.select_set(False)
 return finish(o,name,m,bone)
def tube(name,points,radius,m,bone='Head',radii=None):
 curve=bpy.data.curves.new(name,'CURVE');curve.dimensions='3D';curve.resolution_u=8;curve.bevel_depth=radius;curve.bevel_resolution=3
 spline=curve.splines.new('BEZIER');spline.bezier_points.add(len(points)-1)
 for i,(p,co) in enumerate(zip(spline.bezier_points,points)):
  p.co=co;p.handle_left_type='AUTO';p.handle_right_type='AUTO';p.radius=radii[i] if radii else 1
 o=bpy.data.objects.new(name,curve);bpy.context.collection.objects.link(o);bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o=bpy.context.object;o.select_set(False)
 return finish(o,name,m,bone)
# Body core has a soft silhouette, with real front, back and side geometry.
loft('Body',[(0,0,1.42,.20,.13),(0,.01,1.53,.30,.18),(0,0,1.68,.29,.17),(0,0,1.83,.23,.14),(0,0,2.03,.27,.17),(0,0,2.20,.32,.18),(0,0,2.32,.34,.15),(0,0,2.40,.28,.12),(0,0,2.43,.12,.10)],skin)
sphere('Neck',(0,0,2.49),(.10,.10,.20),skin,'Neck')
# Face: tapered jaw, full cheeks and a gentle forehead rather than a plain sphere.
bpy.ops.mesh.primitive_uv_sphere_add(segments=40,ring_count=32,location=(0,-.005,2.87));head=bpy.context.object
for v in head.data.vertices:
 x,y,z=v.co; jaw=.78+.22*min(1,max(0,(z+.65)/.85));v.co=(x*.285*jaw,y*.235*(.92 if z<-.2 else 1),z*.365)
finish(head,'Face',skin,'Head')
for side in [-1,1]:
 sphere('Ear'+str(side),(side*.273,.005,2.85),(.055,.044,.088),skin,'Head',20,12)
 sphere('Ear inner'+str(side),(side*.297,-.025,2.85),(.017,.012,.049),earmat,'Head',16,10)
 # Eyes follow the curved face. Small irises and lids avoid a toy's staring eyeballs.
 x=side*.112
 eye=sphere('Eye'+str(side),(x,-.216,2.915),(.063,.029,.038),eyeWhite,'Head',24,16)
 sphere('Iris'+str(side),(x,-.247,2.915),(.025,.008,.027),iris,'Head',24,16)
 sphere('Pupil'+str(side),(x,-.255,2.916),(.012,.004,.017),pupil,'Head',20,12)
 sphere('Eye sparkle'+str(side),(x-.009,-.259,2.929),(.007,.003,.008),eyeWhite,'Head',12,8)
 tube('Upper lash'+str(side),[(x-.068,-.220,2.918),(x,-.251,2.955),(x+.068,-.220,2.918)],.007,brow,radii=[.35,.8,.35])
 tube('Lower lid'+str(side),[(x-.065,-.220,2.909),(x,-.245,2.876),(x+.065,-.220,2.909)],.005,skin,radii=[.3,1,.3])
 tube('Brow'+str(side),[(x-.065,-.203,2.998),(x,-.222,3.015),(x+.060,-.199,3.004)],.013,brow,radii=[.2,.65,.2])
 # Sculpted eyelids are hidden at rest and scaled for blinks in the game.
 lid=sphere('Blink'+('L' if side<0 else 'R'),(x,-.246,2.918),(.076,.021,.049),skin,'Head',24,12)
 lid.hide_render=True # export excluded, added as procedural eyelids at runtime
 bpy.data.objects.remove(lid,do_unlink=True);objects.pop();weights.pop('Blink'+('L' if side<0 else 'R'),None)
sphere('Nose bridge',(0,-.221,2.856),(.031,.036,.072),skin,'Head',20,16)
sphere('Nose tip',(0,-.263,2.825),(.040,.036,.031),skin,'Head',24,16)
for side in [-1,1]:sphere('Nostril wing'+str(side),(side*.029,-.246,2.818),(.021,.023,.016),skin,'Head',16,10)
tube('Smile', [(-.069,-.210,2.754),(-.035,-.231,2.746),(0,-.236,2.747),(.035,-.231,2.746),(.069,-.210,2.754)],.010,lips,radii=[.15,.65,.8,.65,.15])
tube('Lower lip',[(-.049,-.218,2.742),(0,-.237,2.731),(.049,-.218,2.742)],.011,lips,radii=[.1,.8,.1])
# Short sculpted pixie cap, with a hairline that clears the face.
verts=[];faces=[];N=48;M=14
for j in range(M+1):
 t=j/M
 for i in range(N):
  a=i*2*pi/N
  front=max(0,-sin(a));limit=1.90-.70*front
  theta=.025+t*limit
  verts.append((.303*sin(theta)*cos(a),.259*sin(theta)*sin(a)+.012,2.89+.39*cos(theta)))
for j in range(M):
 for i in range(N):a=j*N+i;b=j*N+(i+1)%N;faces.append((a,b,b+N,a+N))
mesh=bpy.data.meshes.new('Pixie cap');mesh.from_pydata(verts,[],faces);mesh.update();o=bpy.data.objects.new('Pixie cap',mesh);bpy.context.collection.objects.link(o);finish(o,'Pixie cap',hair,'Head')
# Curved, tapered locks sweep across her forehead and wrap the crown.
for i in range(8):
 t=i/7;x=-.24+t*.48
 tube('Swept fringe %02d'%i,[(x*.3+.05,-.10,3.27),(x*.9,-.22,3.22),(x-.075,-.268,3.10-.10*(1-t))],.052,hair,radii=[.45,1,.015])
for side in [-1,1]:
 for i in range(5):
  tube('Side lock'+str(side)+str(i),[(side*.20,.09-i*.04,3.19),(side*.30,.06-i*.04,3.02),(side*.27,.08-i*.025,2.91)],.032,hair if i%2 else highlight,radii=[.4,1,.02])
for i in range(7):
 a=i*pi/3.5
 tube('Crown lock'+str(i),[(.06*cos(a),.02+.05*sin(a),3.29),(.20*cos(a),.02+.17*sin(a),3.25),(.28*cos(a),.02+.23*sin(a),3.10)],.030,hair if i%2 else highlight,radii=[.35,1,.02])
# Tank top: cloth shell, edging, and straps pass over the shoulders.
loft('Tank top',[(0,0,1.84,.238,.148),(0,0,1.87,.243,.152),(0,-.003,2.0,.275,.177),(0,-.005,2.14,.325,.193),(0,0,2.22,.321,.176)],white)
tube('Tank hem',[(.237*cos(a),.151*sin(a),1.854) for a in [i*2*pi/24 for i in range(25)]],.009,white,'Chest')
for side in [-1,1]:tube('Tank strap'+str(side),[(side*.195,-.145,2.20),(side*.21,-.10,2.40),(side*.21,.03,2.43),(side*.195,.13,2.21)],.025,white,'Chest')
# Shorts use an opaque upper shell to cover the pelvis and connected tailored legs.
loft('Shorts body',[(0,0,1.40,.275,.17),(0,0,1.48,.307,.186),(0,0,1.60,.311,.189),(0,0,1.665,.296,.18)],white,'Hips')
# Shorts waistband and leg hems.
loft('Shorts waistband',[(0,0,1.62,.300,.184),(0,0,1.67,.293,.175),(0,0,1.69,.284,.171)],white,'Hips')
for side,label in [(-1,'L'),(1,'R')]:
 x=side*.16
 loft('Shorts '+label,[(x,0,1.32,.153,.158),(x,0,1.36,.16,.17),(x,0,1.52,.175,.18),(x*.8,0,1.65,.175,.18)],white,'UpperLeg'+label)
 # Tapered legs with knees and ankles; parenting to the armature is continuous-weighted below.
 loft('Leg '+label,[(x,-.045,.12,.049,.065),(x,-.015,.24,.052,.058),(x,.02,.52,.081,.085),(x,0,.82,.078,.085),(x,-.015,1.0,.106,.12),(x,0,1.29,.142,.15),(x,0,1.48,.151,.15)],skin,'Leg'+label)
 sphere('Foot '+label,(x,-.10,.085),(.071,.157,.075),skin,'Foot'+label)
 # Natural resting arm taper rather than a chain of spheres.
 loft('Arm '+label,[(side*.51,0,1.57,.043,.044),(side*.50,0,1.72,.049,.052),(side*.47,.01,1.94,.067,.067),(side*.44,0,2.14,.075,.079),(side*.365,0,2.35,.105,.104)],skin,'Arm'+label)
 sphere('Palm '+label,(side*.515,-.01,1.50),(.050,.037,.098),skin,'Hand'+label)
 for f in range(4):
  fx=side*(.481+f*.022)
  tube('Finger '+label+str(f),[(fx,-.014,1.47),(fx,-.022,1.407),(fx,-.031,1.365+(abs(f-1.3)*.012))],.011,skin,'Hand'+label,radii=[1,.9,.55])
 tube('Thumb '+label,[(side*.477,-.014,1.53),(side*.449,-.035,1.49),(side*.444,-.046,1.46)],.017,skin,'Hand'+label,radii=[1,.9,.5])
for side in [-1,1]:sphere('Shoulder'+str(side),(side*.325,0,2.33),(.135,.12,.125),skin,'Chest')
# Fuse the skin into a continuous surface so joints do not separate during motion.
bpy.ops.object.select_all(action='DESELECT')
skin_objects=[o for o in objects if o.name in bpy.data.objects and o.data.materials[0]==skin]
for o in skin_objects:o.select_set(True)
bpy.context.view_layer.objects.active=skin_objects[0]
old_names=[o.name for o in skin_objects]
bpy.ops.object.join();body=bpy.context.object;body.name='Stella skin'
remesh=body.modifiers.new('Continuous sculpt','REMESH');remesh.mode='VOXEL';remesh.voxel_size=.013;remesh.use_smooth_shade=True
bpy.ops.object.modifier_apply(modifier=remesh.name)
smooth=body.modifiers.new('Skin polish','SMOOTH');smooth.factor=.9;smooth.iterations=4;bpy.ops.object.modifier_apply(modifier=smooth.name)
dec=body.modifiers.new('Mobile topology','DECIMATE');dec.ratio=.48;bpy.ops.object.modifier_apply(modifier=dec.name)
objects=[o for o in bpy.data.objects if o.type=='MESH']
weights[body.name]='SmoothSkin'

# Armature with explicit, predictable deformation weights.
armdata=bpy.data.armatures.new('Stella rig');rig=bpy.data.objects.new('StellaRig',armdata);bpy.context.collection.objects.link(rig);bpy.context.view_layer.objects.active=rig;rig.select_set(True);bpy.ops.object.mode_set(mode='EDIT')
def bone(name,head,tail,parent=None):
 b=armdata.edit_bones.new(name);b.head=head;b.tail=tail
 if parent:b.parent=armdata.edit_bones[parent]
 return b
bone('Hips',(0,0,1.48),(0,0,1.84));bone('Chest',(0,0,1.84),(0,0,2.38),'Hips');bone('Neck',(0,0,2.38),(0,0,2.63),'Chest');bone('Head',(0,0,2.63),(0,0,3.23),'Neck')
for side,label in [(-1,'L'),(1,'R')]:
 bone('UpperArm'+label,(side*.365,0,2.35),(side*.47,.01,1.94),'Chest');bone('Forearm'+label,(side*.47,.01,1.94),(side*.51,0,1.57),'UpperArm'+label);bone('Hand'+label,(side*.51,0,1.57),(side*.515,-.01,1.41),'Forearm'+label)
 bone('UpperLeg'+label,(side*.16,0,1.48),(side*.16,0,.82),'Hips');bone('LowerLeg'+label,(side*.16,0,.82),(side*.16,-.045,.12),'UpperLeg'+label);bone('Foot'+label,(side*.16,-.045,.12),(side*.16,-.22,.08),'LowerLeg'+label)
bpy.ops.object.mode_set(mode='OBJECT')
for o in objects:
 if o.name not in bpy.data.objects:continue
 kind=weights[o.name]
 for v in o.data.vertices:
  co=o.matrix_world@v.co;z=co.z;assign={}
  if kind=='SmoothSkin':
   ax=abs(co.x);label='L' if co.x<0 else 'R'
   if z>2.59:assign={'Head':1}
   elif z>2.4 and ax<.17:
    t=max(0,min(1,(z-2.46)/.14));assign={'Head':t,'Neck':1-t}
   elif (ax>.38 and z>1.32 and z<2.3) or (ax>.29 and z>=2.3 and z<2.48):
    arm=max(0,min(1,(ax-.28)/.14))
    if z<1.58:assign={'Hand'+label:1}
    else:
     t=max(0,min(1,(z-1.84)/.2));assign={'UpperArm'+label:t*arm,'Forearm'+label:(1-t)*arm,'Chest':1-arm}
   elif z<1.46:
    if z<.20:
     t=max(0,min(1,(z-.11)/.13));assign={'LowerLeg'+label:t,'Foot'+label:1-t}
    else:
     t=max(0,min(1,(z-.73)/.18));assign={'UpperLeg'+label:t,'LowerLeg'+label:1-t}
   else:
    t=max(0,min(1,(z-1.67)/.4));assign={'Chest':t,'Hips':1-t}
  elif kind.startswith('Leg'):
   label=kind[-1];t=max(0,min(1,(z-.73)/.18));assign={'UpperLeg'+label:t,'LowerLeg'+label:1-t}
  elif kind.startswith('Arm'):
   label=kind[-1];t=max(0,min(1,(z-1.84)/.20));assign={'UpperArm'+label:t,'Forearm'+label:1-t}
  elif kind=='Chest':
   t=max(0,min(1,(z-1.67)/.4));assign={'Chest':t,'Hips':1-t}
  else:assign={kind:1}
  for name,value in assign.items():
   if value>0:
    g=o.vertex_groups.get(name) or o.vertex_groups.new(name=name);g.add([v.index],value,'REPLACE')
 mod=o.modifiers.new('Stella skeleton','ARMATURE');mod.object=rig;o.parent=rig
# Retain named rig nodes even when they have no animation track yet.
rig['description']='Original stylized Stella. Blonde pixie hair, blue eyes, white tank and shorts. Procedural artist source.'
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
assetdir=os.path.join(root,'dist') if os.path.isdir(os.path.join(root,'dist')) else root
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(root,'art','Stella.blend'))
bpy.ops.export_scene.gltf(filepath=os.path.join(assetdir,'stella.glb'),export_format='GLB',export_yup=True,export_animations=False,export_skins=True,export_def_bones=True,export_apply=False)
print('STELLA_MODEL_EXPORTED',os.path.getsize(os.path.join(assetdir,'stella.glb')))
