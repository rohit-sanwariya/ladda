import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';

export function ngAdd(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    // Add a package dependency to the project
    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: 'ngr-ladda',
      version: '1.0.0'
    });

    // Add any other setup code here (e.g., import modules in app module, update angular.json, etc.)

    return tree;
  };
}
