"""Refined Stella: CC0 MakeHuman anatomy adapted to the supplied visual reference.
The source photograph is never used as a gameplay sprite or projected face.
"""
import bpy,json,math,os
from pathlib import Path
from mathutils import Vector,Quaternion
from mathutils.bvhtree import BVHTree
from math import sin,cos,pi
ROOT=Path(__file__).resolve().parents[1];VENDOR=ROOT/'art/vendor';ASSETS=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def readobj(path):
 v=[];groups={};group='default';uv=[];faces=[]
 for line in open(path):
  s=line.split()
  if not s:continue
  if s[0]=='v':v.append(Vector(tuple(map(float,s[1:4]))))
  elif s[0]=='g':group=s[1]
  elif s[0]=='f':
   f=[int(t.split('/')[0])-1 for t in s[1:]];groups.setdefault(group,[]).append(f);faces.append(f)
 return v,groups,faces
raw,groups,_=readobj(VENDOR/'base.obj');original=[v.copy() for v in raw]
for line in open(VENDOR/'female-young.target'):
 s=line.split()
 if len(s)==4 and s[0].isdigit():raw[int(s[0])]+=Vector(tuple(map(float,s[1:])))
# A restrained lift at the mouth corners echoes the reference's relaxed expression.
for v in raw:
 if abs(v.x)<.32 and 6.16<v.y<6.44 and v.z>1.28:
  v.y+=.045*(abs(v.x)/.32)**1.2*max(0,1-abs(v.y-6.30)/.15)
rigdata=json.load(open(VENDOR/'rig.json'));weightdata=json.load(open(VENDOR/'weights.json'))['weights']
bodyids=sorted({i for f in groups['body'] for i in f});floor=min(raw[i].y for i in bodyids);height=max(raw[i].y for i in bodyids)-floor;scale=3.2/height
# More natural seven-head proportions and a slightly slimmer silhouette match the reference.
def transform(v):
 p=Vector((v.x*scale,-v.z*scale,(v.y-floor)*scale))
 h=max(0,min(1,(p.z-2.68)/.18));p.x*=1+.08*h;p.y=-.08+(p.y+.08)*(1+.04*h);p.z+=(p.z-2.7)*.12*h
 if p.z<2.35:p.x*=.94
 return p
verts=[transform(v) for v in raw]
def joint(name):return sum((verts[i] for i in rigdata['joints'][name]),Vector())/len(rigdata['joints'][name])
def point(bone,which='head'):return joint(rigdata['bones'][bone][which])
def material(name,color,rough=.55):
 m=bpy.data.materials.new(name);m.use_nodes=True;m.diffuse_color=(*color,1);p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough
 if name=='Stella fair skin':p.inputs['Subsurface Weight'].default_value=.12
 return m
skin=material('Stella fair skin',(.71,.46,.36),.62);cloth=material('White soft cotton',(.89,.90,.91),.87)
lips=material('Natural rose lips',(.47,.245,.215),.65);hair=material('Ash blonde roots',(.255,.20,.135),.67);hairlight=material('Sandy blonde layers',(.43,.34,.23),.62)
white=material('Eye whites',(.82,.85,.84),.24);blue=material('Blue irises',(.045,.18,.30),.28);black=material('Pupils',(.003,.008,.013),.24);brow=material('Brows and lashes',(.19,.125,.075),.75)
# Preserve the supplied skinning, collapsing helper/twist/facial bones onto the existing game rig.
def mapping(name):
 side='L' if name.endswith('.L') else 'R'
 if name.startswith('upperarm'):return 'UpperArm'+side
 if name.startswith('lowerarm'):return 'Forearm'+side
 if name.startswith(('wrist','finger','thumb','metacarpal')):return 'Hand'+side
 if name.startswith('upperleg'):return 'UpperLeg'+side
 if name.startswith('lowerleg'):return 'LowerLeg'+side
 if name.startswith(('foot','toe')):return 'Foot'+side
 if name.startswith('neck'):return 'Neck'
 if name.startswith(('shoulder','breast','clavicle')) or name in ['spine01','spine02']:return 'Chest'
 if name.startswith(('spine','pelvis','root')):return 'Hips'
 return 'Head'
weights=[{} for _ in raw]
for name,items in weightdata.items():
 b=mapping(name)
 for i,w in items:weights[i][b]=weights[i].get(b,0)+w
armdata=bpy.data.armatures.new('Stella skeleton');rig=bpy.data.objects.new('StellaRig',armdata);bpy.context.collection.objects.link(rig);bpy.context.view_layer.objects.active=rig;rig.select_set(True);bpy.ops.object.mode_set(mode='EDIT')
def bone(name,a,b,parent=None):
 x=armdata.edit_bones.new(name);x.head=a;x.tail=b
 if parent:x.parent=armdata.edit_bones[parent]
hips=(point('upperleg01.L')+point('upperleg01.R'))/2
bone('Hips',hips,point('spine02'));bone('Chest',point('spine02'),point('neck01'),'Hips');bone('Neck',point('neck01'),point('head'),'Chest');bone('Head',point('head'),point('head','tail'),'Neck')
# MH left is positive X; game labels preserve their established anatomical sides.
for side in ['L','R']:
 bone('UpperArm'+side,point('upperarm01.'+side),point('lowerarm01.'+side),'Chest')
 bone('Forearm'+side,point('lowerarm01.'+side),point('wrist.'+side),'UpperArm'+side)
 bone('Hand'+side,point('wrist.'+side),point('wrist.'+side,'tail'),'Forearm'+side)
 bone('UpperLeg'+side,point('upperleg01.'+side),point('lowerleg01.'+side),'Hips')
 bone('LowerLeg'+side,point('lowerleg01.'+side),point('foot.'+side),'UpperLeg'+side)
 bone('Foot'+side,point('foot.'+side),point('foot.'+side,'tail'),'LowerLeg'+side)
bpy.ops.object.mode_set(mode='OBJECT')
old_to_new={v:i for i,v in enumerate(bodyids)}
mesh=bpy.data.meshes.new('Anatomical skin');mesh.from_pydata([verts[i] for i in bodyids],[],[[old_to_new[i] for i in f] for f in groups['body']]);mesh.update();body=bpy.data.objects.new('Stella skin',mesh);bpy.context.collection.objects.link(body);body.data.materials.append(skin);body.data.materials.append(lips)
for p,f in zip(mesh.polygons,groups['body']):
 c=sum((raw[i] for i in f),Vector())/len(f)
 if 6.235<c.y<6.365 and c.z>1.33 and abs(c.x)<.30:p.material_index=1
 p.use_smooth=True
for i,old in enumerate(bodyids):
 total=sum(weights[old].values()) or 1
 for name,w in weights[old].items():
  if w>.0001:(body.vertex_groups.get(name) or body.vertex_groups.new(name=name)).add([i],w/total,'REPLACE')
mod=body.modifiers.new('Deform rig','ARMATURE');mod.object=rig
# Lower the reference A-pose into a natural rest stance, baking it into both skin and rig.
for side,sign in [('L',1),('R',-1)]:
 for name,angle in [('UpperArm'+side,.60),('UpperLeg'+side,.095)]:
  b=rig.pose.bones[name];basis=b.bone.matrix_local.to_quaternion();b.rotation_mode='QUATERNION';b.rotation_quaternion=basis.inverted()@Quaternion(Vector((0,1,0)),sign*angle)@basis
bpy.context.view_layer.update();bpy.context.view_layer.objects.active=body;body.select_set(True);bpy.ops.object.modifier_apply(modifier=mod.name)
bpy.context.view_layer.objects.active=rig;bpy.ops.object.mode_set(mode='POSE');bpy.ops.pose.armature_apply(selected=False);bpy.ops.object.mode_set(mode='OBJECT')
# Body-surface clothing follows exactly the same weighted topology, avoiding clipping at the hips.
def garment(name,predicate):
 faces=[];ids=set()
 for poly in body.data.polygons:
  center=sum((body.data.vertices[i].co for i in poly.vertices),Vector())/len(poly.vertices)
  torso=0
  for i in poly.vertices:
   torso+=sum(g.weight for g in body.data.vertices[i].groups if body.vertex_groups[g.group].name.startswith(('Hips','Chest','UpperLeg')))
  if predicate(center) and torso/len(poly.vertices)>.75:faces.append(list(poly.vertices));ids.update(poly.vertices)
 ids=sorted(ids);remap={v:i for i,v in enumerate(ids)};vs=[body.data.vertices[i].co+body.data.vertices[i].normal*.009 for i in ids]
 m=bpy.data.meshes.new(name);m.from_pydata(vs,[],[[remap[i] for i in f] for f in faces]);m.update();o=bpy.data.objects.new(name,m);bpy.context.collection.objects.link(o);m.materials.append(cloth)
 for poly in m.polygons:poly.use_smooth=True
 for i,old in enumerate(ids):
  for g in body.data.vertices[old].groups:
   n=body.vertex_groups[g.group].name;(o.vertex_groups.get(n) or o.vertex_groups.new(name=n)).add([i],g.weight,'REPLACE')
 sub=o.modifiers.new('Soft fabric topology','SUBSURF');sub.levels=1;bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.modifier_apply(modifier=sub.name)
 shrink=o.modifiers.new('Fabric fit','SHRINKWRAP');shrink.target=body;shrink.wrap_method='NEAREST_SURFACEPOINT';shrink.offset=.010;bpy.ops.object.modifier_apply(modifier=shrink.name)
 solid=o.modifiers.new('Fabric edge thickness','SOLIDIFY');solid.thickness=.004;bpy.ops.object.modifier_apply(modifier=solid.name)
 return o
# Fit a smooth, closed-loop tank shell to the torso BVH. Arms are excluded from this surface.
torso_faces=[]
for poly in body.data.polygons:
 total=sum(sum(g.weight for g in body.data.vertices[i].groups if body.vertex_groups[g.group].name in ['Chest','Hips']) for i in poly.vertices)/len(poly.vertices)
 if total>.80:torso_faces.append(list(poly.vertices))
torso_bvh=BVHTree.FromPolygons([v.co for v in body.data.vertices],torso_faces,all_triangles=False)
rows=16;segments=64;tv=[];tf=[];tw=[]
for j in range(rows+1):
 t=j/rows
 for i in range(segments):
  a=i*2*pi/segments;front=max(0,-sin(a));top=2.475-.035*front**2
  z=1.94+(top-1.94)*t;center=Vector((0,-.045,z));direction=Vector((cos(a),sin(a),0))
  hit,normal,idx,dist=torso_bvh.ray_cast(center+direction*.9,-direction,1.5)
  if hit is None:hit=Vector((.30*cos(a),-.045+.20*sin(a),z));normal=direction;idx=None
  tv.append(tuple(hit+normal*.026));tw.append(idx)
for j in range(rows):
 for i in range(segments):a=j*segments+i;b=j*segments+(i+1)%segments;tf.append((a,b,b+segments,a+segments))
m=bpy.data.meshes.new('Fitted scoop-neck tank');m.from_pydata(tv,[],tf);m.update();top=bpy.data.objects.new('Fitted scoop-neck tank',m);bpy.context.collection.objects.link(top);m.materials.append(cloth)
for poly in m.polygons:poly.use_smooth=True
for i,idx in enumerate(tw):
 combined={}
 if idx is not None:
  for vi in torso_faces[idx]:
   for g in body.data.vertices[vi].groups:
    n=body.vertex_groups[g.group].name;combined[n]=combined.get(n,0)+g.weight/len(torso_faces[idx])
 else:combined={'Chest':1}
 total=sum(combined.values()) or 1
 for n,w in combined.items():(top.vertex_groups.get(n) or top.vertex_groups.new(name=n)).add([i],w/total,'REPLACE')
solid=top.modifiers.new('Tank cloth thickness','SOLIDIFY');solid.thickness=.004;bpy.context.view_layer.objects.active=top;top.select_set(True);bpy.ops.object.modifier_apply(modifier=solid.name)
shorts=garment('Fitted white shorts',lambda p:1.47<p.z<1.85 and abs(p.x)<.43)
for v in shorts.data.vertices:
 if v.co.z<1.51:v.co.z=1.48
 if v.co.z>1.81:v.co.z=1.84
# Smooth anatomical skin without destroying lips, fingers, eyelids or ankle connections.
sub=body.modifiers.new('Anatomy smoothness','SUBSURF');sub.levels=1;bpy.context.view_layer.objects.active=body;bpy.ops.object.modifier_apply(modifier=sub.name)
dec=body.modifiers.new('Mobile skin budget','DECIMATE');dec.ratio=.65;bpy.context.view_layer.objects.active=body;bpy.ops.object.modifier_apply(modifier=dec.name)
# Face details fit the actual eye socket centers, not a cartoon ellipsoid.
def add_weights(o,name):
 g=o.vertex_groups.new(name=name);g.add(list(range(len(o.data.vertices))),1,'REPLACE')
def sphere(name,loc,size,mat,segments=24,rings=16):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=loc);o=bpy.context.object;o.name=name;o.scale=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mat)
 for p in o.data.polygons:p.use_smooth=True
 add_weights(o,'Head');return o
def tube(name,points,radius,mat,radii=None):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.resolution_u=8;c.bevel_depth=radius;c.bevel_resolution=3
 s=c.splines.new('BEZIER');s.bezier_points.add(len(points)-1)
 for i,(p,co) in enumerate(zip(s.bezier_points,points)):p.co=co;p.handle_left_type='AUTO';p.handle_right_type='AUTO';p.radius=radii[i] if radii else 1
 o=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(o);bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o=bpy.context.object;o.data.materials.append(mat)
 for p in o.data.polygons:p.use_smooth=True
 add_weights(o,'Head');return o
# Fine straps follow the actual shoulder surface and join the tank at front and back.
for side in [-1,1]:
 x=side*.205;points=[]
 for z,back in [(2.45,False),(2.55,False),(2.625,False),(2.64,True),(2.56,True),(2.47,True)]:
  origin=Vector((x,1 if back else -1,z));direction=Vector((0,-1 if back else 1,0))
  hit,loc,normal,idx=body.ray_cast(origin,direction)
  points.append((x,loc.y+(.010 if back else -.010) if hit else (.05 if back else -.12),z))
 o=tube('Fine tank strap '+str(side),points,.009,cloth)
 for g in list(o.vertex_groups):o.vertex_groups.remove(g)
 add_weights(o,'Chest')
eye_centers=[]
# The bundled CC0 eye surface was designed for this base topology.
ev,eg,ef=readobj(VENDOR/'eyes.obj')
for side,label in [(1,'L'),(-1,'R')]:
 oldcenter=sum((original[i] for i in rigdata['joints']['eye.'+label+'____head']),Vector())/8
 newcenter=sum((raw[i] for i in rigdata['joints']['eye.'+label+'____head']),Vector())/8
 center=transform(newcenter);eye_centers.append(center)
 ids=[i for i,p in enumerate(ev) if p.x*side>0];remap={v:i for i,v in enumerate(ids)};fs=[[remap[i] for i in f] for f in ef if all(i in remap for i in f)]
 m=bpy.data.meshes.new('Eye surface '+label);m.from_pydata([transform(ev[i]+newcenter-oldcenter) for i in ids],[],fs);m.update();o=bpy.data.objects.new('Eye '+label,m);bpy.context.collection.objects.link(o);m.materials.append(white)
 sub=o.modifiers.new('Eye smoothness','SUBSURF');sub.levels=2;bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.modifier_apply(modifier=sub.name)
 for p in o.data.polygons:p.use_smooth=True
 add_weights(o,'Head')
 iriscenter=center+Vector((0,-.028,0))
 sphere('Iris '+label,iriscenter,(.012,.004,.013),blue)
 sphere('Pupil '+label,iriscenter+Vector((0,-.0035,0)),(.0055,.002,.007),black)
 sphere('Eye sparkle '+label,iriscenter+Vector((-.003,-.006,.004)),(.002,.001,.0022),white,12,8)
 # A brow hugs the forehead above the actual socket.
 points=[]
 for j in range(5):
  t=j/4;x=center.x+(t-.5)*.081;z=center.z+.049+.009*sin(pi*t)
  hit,loc,normal,index=body.ray_cast(Vector((x,-1,z)),Vector((0,1,0)))
  points.append((x,loc.y-.003 if hit else center.y-.015,z))
 tube('Brow '+label,points,.0038,brow,[.15,.75,1,.7,.15])
# Blink closes the actual eyelid surface. The eyeballs retain their round shape.
basis=body.shape_key_add(name='Basis');blink=body.shape_key_add(name='Blink')
for v in blink.data:
 for e in eye_centers:
  dx=abs(v.co.x-e.x);dz=v.co.z-e.z
  if dx<.034 and -.020<dz<.028 and v.co.y<e.y-.008:
   strength=max(0,1-(dx/.034)**2)
   if dz>0:v.co.z-=min(dz+.003,.026)*strength
   else:v.co.z+=min(-dz,.007)*strength
# Tapered ash-blonde pixie, with layered side-swept fringe, close sides and tousled crown.
HC=Vector((0,-.092,3.025));RX=.170;RY=.194;RZ=.247
head_bvh=BVHTree.FromPolygons([v.co for v in body.data.vertices],[list(p.vertices) for p in body.data.polygons],all_triangles=False)
def scalp(p,offset=.012):
 d=(Vector(p)-HC).normalized();hit,normal,idx,dist=head_bvh.ray_cast(HC+d*.7,-d,1.1)
 return hit+normal*offset if hit is not None else Vector(p)
vertices=[];faces=[];N=48;M=16
for j in range(M+1):
 for i in range(N):
  a=i*2*pi/N;t=.018+j/M*(2.10-1.05*max(0,-sin(a)))
  vertices.append(tuple(scalp((RX*sin(t)*cos(a),HC.y+RY*sin(t)*sin(a),HC.z+RZ*cos(t)))))
for j in range(M):
 for i in range(N):a=j*N+i;b=j*N+(i+1)%N;faces.append((a,b,b+N,a+N))
m=bpy.data.meshes.new('Pixie foundation');m.from_pydata(vertices,[],faces);m.update();o=bpy.data.objects.new('Pixie foundation',m);bpy.context.collection.objects.link(o);m.materials.append(hair)
for p in m.polygons:p.use_smooth=True
add_weights(o,'Head')
def lock(name,ps,width,mat):
 ps=[Vector(p) for p in ps];vs=[];fs=[];rows=12;around=8
 for j in range(rows+1):
  t=j/rows;c=(1-t)**2*ps[0]+2*t*(1-t)*ps[1]+t*t*ps[2];c=scalp(c,(.024+.014*sin(pi*t)) if t<.85 else .014);tan=(2*(1-t)*(ps[1]-ps[0])+2*t*(ps[2]-ps[1])).normalized();normal=Vector((c.x/RX,(c.y-HC.y)/RY,(c.z-HC.z)/RZ)).normalized();cross=tan.cross(normal).normalized();normal=cross.cross(tan).normalized();r=width*(.4+.7*sin(pi*t))*(1-t)**.55+.0005
  for k in range(around):a=k*2*pi/around;vs.append(tuple(c+cross*cos(a)*r+normal*sin(a)*r*.25))
 for j in range(rows):
  for k in range(around):a=j*around+k;b=j*around+(k+1)%around;fs.append((a,b,b+around,a+around))
 fs.append(tuple(range(around-1,-1,-1)));fs.append(tuple(rows*around+k for k in range(around)))
 m=bpy.data.meshes.new(name);m.from_pydata(vs,[],fs);m.update();o=bpy.data.objects.new(name,m);bpy.context.collection.objects.link(o);m.materials.append(mat)
 for p in m.polygons:p.use_smooth=True
 add_weights(o,'Head')
for i in range(14):
 t=i/13;x=-.145+.30*t
 lock('Side-swept fringe %02d'%i,[(.05+.022*sin(i),-.07,3.285),(.025+x*.65,-.295,3.21-.025*(1-t)),(x-.012,-.281,3.095-.072*(1-t))],.027+(i%3)*.002,hairlight if i%4 else hair)
for side in [-1,1]:
 for i in range(7):
  lock('Layered side '+str(side)+' '+str(i),[(side*.11,.035-i*.025,3.23),(side*.182,.045-i*.025,3.13),(side*.158,.062-i*.021,2.97+.018*sin(i))],.025,hairlight if i%3 else hair)
for i in range(15):
 a=i*2*pi/15
 lock('Tousled crown '+str(i),[(.03*cos(a),HC.y+.04*sin(a),3.28),(.14*cos(a),HC.y+.16*sin(a),3.28+.012*sin(i)),(.175*cos(a),HC.y+.192*sin(a),3.105+.025*sin(i*2))],.028,hairlight if i%3 else hair)
# Attach every visible mesh to the same rig; no primitive hands/feet or sliced photos remain.
for o in list(bpy.data.objects):
 if o.type!='MESH':continue
 mod=o.modifiers.new('Stella deformation','ARMATURE');mod.object=rig;o.parent=rig
rig['description']='Reference-guided Stella with adapted CC0 human anatomy, pixie hair, white basics and a 16-bone game rig.'
rig['source']='MakeHuman CC0 assets; see art/vendor/LICENSE-CC0.md and THIRD_PARTY.md'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'art/Stella.blend'))
bpy.ops.export_scene.gltf(filepath=str(ASSETS/'stella.glb'),export_format='GLB',export_yup=True,export_animations=False,export_skins=True,export_morph=True,export_def_bones=True,export_apply=False,export_extras=True)
print('STELLA_REFINED',os.path.getsize(ASSETS/'stella.glb'))
