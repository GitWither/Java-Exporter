var plugin_data = {
	id: 'java_exporter',
	title: 'Java Exporter',  
	icon: 'free_breakfast',
	author: 'Wither',
	description: 'Export .java models',
	version: '1.0.0',
	variant: 'both'
}

var class_name = ''
var package = ''

MenuBar.addAction(new Action({
    id: 'export_java',
    name: 'Export Java Model',
    icon: 'free_breakfast',
	category: 'file',
	condition: () => !Blockbench.entity_mode,
    click: function(ev) {
        export_dialog.show();
    }
}), 'file.export')

function buildJavaModel() {
	var content = ''

	content += `//${settings.credit.value}\n\n`;
	content += `package ${package};\n\n`;
	content += 'import net.minecraft.client.model.ModelBase;\n';
	content += 'import net.minecraft.client.model.ModelRenderer;\n';
	content += 'import net.minecraft.entity.Entity;\n\n';
	content += `public class ${class_name} extends ModelBase {\n`;
	for (i = 0; i < Blockbench.elements.length; i++) {
		content += `    ModelRenderer ${Blockbench.elements[i].name}_${i};\n`;
	}
	content += `\n      public ${class_name}() {\n`;
	content += `        this.textureWidth = ${Project.texture_width};\n`;
	content += `        this.textureHeight = ${Project.texture_height};\n\n`;
	for (i = 0; i < Blockbench.elements.length; i++) {
		content += `        this.${Blockbench.elements[i].name}_${i} = new ModelRenderer(this, ${Math.round(Blockbench.elements[i].faces.north.uv[0])}, ${Math.round(Blockbench.elements[i].faces.north.uv[1])});\n`;
		content += `        this.${Blockbench.elements[i].name}_${i}.addBox(${Blockbench.elements[i].from[0]}F, ${Blockbench.elements[i].from[1]}F, ${Blockbench.elements[i].from[2]}F, ${Blockbench.elements[i].size(0, true)}, ${Blockbench.elements[i].size(1, true)}, ${Blockbench.elements[i].size(2, true)}, 1.0F);\n`;
		content += `        this.${Blockbench.elements[i].name}_${i}.setRotationPoint(${Blockbench.elements[i].origin[0]}F, ${Blockbench.elements[i].origin[1]}F, ${Blockbench.elements[i].origin[2]}F);\n`;
		content += `        this.setRotateAngle(${Blockbench.elements[i].name}_${i}, ${Blockbench.elements[i].rotation[0]}F, ${Blockbench.elements[i].rotation[1]}F, ${Blockbench.elements[i].rotation[2]}F);\n`;
	}
	content += '\n    }\n\n';
	content += '    @Override\n    public void render(Entity entity, float f, float f1, float f2, float f3, float f4, float f5) {\n';
	for (i = 0; i < Blockbench.elements.length; i++) {
		content += `        this.${Blockbench.elements[i].name}_${i}.render(f5);\n`;
	}
	content += '\n    }\n\n';
	content += '    public void setRotateAngle(ModelRenderer modelRenderer, float x, float y, float z) {\n';
	content += '        modelRenderer.rotateAngleX = x;\n        modelRenderer.rotateAngleY = y;\n        modelRenderer.rotateAngleZ = z;\n';
	content += '    }';
    content += '\n}';
    
    return content;
}

var export_dialog = new Dialog({
	title: 'Java Export',
	id: 'java_export_dialog',
	lines:[
	    'Package: <input value=net.minecraft.src type="text" style="background-color:var(--color-back)" id="model_package"><br>',
	    'Class Name: <input value=ModelBlockbench type="text" style="background-color:var(--color-back)" id="class_name"><br/><p></p>',
	    '<p></p>',
	    'Please, keep in mind that you might have to<br> change some values in the result file.',
	    '<br><p></p>'
	]
});

export_dialog.onConfirm = function() {
	package = $('#model_package')[0].value;
	class_name = $('#class_name')[0].value;
    export_dialog.hide();
    Blockbench.export({
        type: 'Java Model',
        extensions: ['java'],
        name: 'Class',
        startpath: Prop.file_path,
        content: buildJavaModel()
    });
}

onUninstall = function() {
	MenuBar.removeAction('file.export.export_java');
}