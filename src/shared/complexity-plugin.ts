import { GraphQLRequestContext } from 'apollo-server-types';

export function complexityPlugin() {
    return {
        requestDidStart() {
            return {
                didResolveOperation({ request, document }: GraphQLRequestContext) {
                    const complexity = calculateQueryComplexity(document);
                    if (complexity > 1000) {
                        throw new Error(`Query too complex: ${complexity}. Maximum allowed complexity: 1000`);
                    }
                },
            };
        },
    };
}

function calculateQueryComplexity(document: any): number {
    let complexity = 0;
    const fragments = {};

    document.definitions.forEach(definition => {
        if (definition.kind === 'FragmentDefinition') {
            fragments[definition.name.value] = definition;
        }
    });

    function calculateNode(node) {
        if (node.selectionSet) {
            node.selectionSet.selections.forEach(selection => {
                complexity++;
                if (selection.kind === 'FragmentSpread') {
                    calculateNode(fragments[selection.name.value]);
                } else {
                    calculateNode(selection);
                }
            });
        }
    }

    document.definitions.forEach(definition => {
        if (definition.kind === 'OperationDefinition') {
            calculateNode(definition);
        }
    });

    return complexity;
}