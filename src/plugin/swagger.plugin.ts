import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync, mkdirSync } from 'fs';

const cleanupDocument = (document: OpenAPIObject, exclude?: string[]): void => {
  for (const [path, pathValue] of Object.entries(document.paths)) {
    for (const [method, methodValue] of Object.entries(pathValue)) {
      for (const [responseCode, responseCodeValue] of Object.entries(methodValue.responses)) {
        /**
         *
         */
        const addr = responseCodeValue['content']?.['application/json']?.['schema'];

        // clean empty response code
        if (!addr?.['items']?.['$ref'] && !addr?.['$ref']) {
          delete document.paths[path][method]['responses'][responseCode];
          continue;
        }

        // clean default response

        delete document.paths[path][method]['responses']['default'];

        if (exclude?.includes(`${method}:${path}`)) {
          continue;
        }

        // translate format

        const schema = responseCodeValue['content']?.['application/json']?.['schema'];

        const isArray = schema.type === 'array';

        let ref: string;

        if (isArray) {
          ref = schema.items?.['$ref'];
        } else {
          ref = schema?.['$ref'];
        }

        const refSchemaUri = ref.split('/');
        const refSchema = refSchemaUri[refSchemaUri.length - 1];

        if (isArray) {
          delete schema.type;
          delete schema.items;
        }
        schema['$ref'] = `#/components/schemas/${refSchema}Std`;

        const dataSchema = isArray
          ? { items: { $ref: `#/components/schemas/${refSchema}` } }
          : { $ref: `#/components/schemas/${refSchema}` };

        const componentsSchema = document.components.schemas;

        if (!componentsSchema[`standardMeta`]) {
          componentsSchema[`standardMeta`] = {
            type: 'object',
            properties: {
              total: { type: 'number' },
              type: { type: 'string' },
              len: { type: 'number' },
            },
            additionalProperties: false,
          };
        }

        componentsSchema[`${refSchema}Std`] = {
          properties: {
            meta: { $ref: '#/components/schemas/standardMeta' },
            data: dataSchema,
          },
          additionalProperties: false,
        };
      }
    }
  }
};

const swaggerCustomConfig = (document: OpenAPIObject): void => {
  // document.servers = [
  //   {
  //     url: 'http://localhost:3000',
  //     description: 'Local',
  //   },
  // ];
};

export const setupSwagger = async (app: INestApplication): Promise<void> => {
  const options = new DocumentBuilder()
    .setTitle('jirjirak api doc')
    // .setVersion(SWAGGER_CONFIG.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  const exclude = ['post:/v1/media/upload', 'post:/v1/auth/login-by-code', 'post:/v1/auth/login-by-password'];

  cleanupDocument(document, exclude);
  swaggerCustomConfig(document);

  // mkdirSync('./dist/public', { recursive: true });
  // writeFileSync(SwaggerJsonAddr, JSON.stringify(document, null, 2));

  SwaggerModule.setup('swagger', app, document, {
    explorer: true,
    uiConfig: { docExpansion: 'none' },
  });
};
