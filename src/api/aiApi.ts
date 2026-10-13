// src/api/aiAPI.ts
export interface AIGenerateRequest {
  prompt: string;
}

export interface AIGenerateResponse {
  dsl: string;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("VITE_OPENAI_API_KEY environment variable is not set");
}

export const aiAPI = {
  generateDiagram: async (
    request: AIGenerateRequest
  ): Promise<AIGenerateResponse> => {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    const systemPrompt = `
You are an expert at generating cloud architecture diagrams using a simple Domain Specific Language (DSL). 
Your output must strictly follow the DSL format described below and use only the icons provided in the available AWS icon list.

1. GROUPS
   - Groups represent logical or physical boundaries (e.g., VPC, Subnet, Availability Zone).
   - Syntax: GroupName { ... }
   - Example:
       VPC {
         PublicSubnet { EC2Instance [icon: EC2Icon] }
       }

2. NODES
   - A node represents a cloud resource or service.
   - Syntax: ServiceName [icon: IconName]
   - ServiceName is a descriptive label for the resource.
   - IconName must exactly match one from the AVAILABLE ICONS list.
   - Example:
       API [icon: APIGateway]
       Database [icon: RDS]

3. CONNECTIONS
   - Connections define relationships between resources.
   - Use ">" for unidirectional data flow.
   - Use "<" for bidirectional.
   - You can fan out from one source to multiple targets:
       A > B, C
   - Examples:
       API > Lambda
       Lambda > DynamoDB
       EC2Instance < RDS

4. CLEAN OUTPUT REQUIREMENTS
   - Output only the DSL code — no explanations, no markdown, no extra formatting.
   - Use consistent indentation for nested groups (2 spaces per level).
   - Do NOT include any text before or after the DSL.

AVAILABLE ICONS
The following icon identifiers are allowed and must match exactly:

EC2Icon, APIGateway, AppRunner, AppFlow, ApplicationAutoScaling, AppSync, Aurora, Batch, Chime, CloudSearch, CodeGuru, ComputeOptimizer, Connect, DataPipeline, DatabaseMigrationService, DataZone, DeepComposer, DevOpsGuru, DocumentDB, DynamoDB, EC2AutoScaling, EC2ImageBuilder, ECSAnywhere, EFS, EKSAnywhere, EKSCloud, EKSDistro, ElasticBeanstalk, ElasticBlockStore, ElasticContainerRegistry, ElasticContainerService, ElasticFabricAdapter, ElasticKubernetesService, ElastiCache, EventBridge, Fargate, Glue, Keyspaces, KinesisDataAnalytics, KinesisDataStreams, KinesisFirehose, KinesisVideoStreams, Kinesis, LakeFormation, Lambda, MemoryDBForRedis, MQ, Neptune, OpenSearchService, QuickSight, RDSonVMware, RDS, RedHatOpenShiftServiceOnAWS, Redshift, SageMakerStudioLab, SageMaker, SimpleQueueService, SimpleStorageService, Snowball, StepFunctions, StorageGateway, TensorFlowOnAWS, Timestream, TorchServe, WorkDocs, WorkMail

EXAMPLE DSL

UserBrowser [icon: EC2Icon]
UserMobile [icon: EC2Icon]

PublicAPI [icon: APIGateway]
SecurityFunction [icon: Lambda]

CognitoUserPool [icon: APIGateway]
IdentityPool [icon: Lambda]
UserDirectory [icon: DynamoDB]

WebsiteApp [icon: AppRunner]
MobileApp [icon: AppSync]

VPC {
  PublicSubnet {
    PublicAPI [icon: APIGateway]
  }
  PrivateSubnet {
    APIService [icon: Lambda]
    TenantManagementDB [icon: Aurora]
    SessionStore [icon: ElastiCache]
  }
}

UserDataBucket [icon: SimpleStorageService]
LoggingService [icon: KinesisDataStreams]

VPC > MainNet

UserBrowser > PublicAPI
UserMobile > PublicAPI

PublicAPI > SecurityFunction

SecurityFunction > WebsiteApp
SecurityFunction > MobileApp

WebsiteApp > CognitoUserPool
MobileApp > CognitoUserPool

CognitoUserPool > IdentityPool

IdentityPool > APIService

APIService > TenantManagementDB
APIService > SessionStore
APIService > UserDataBucket
APIService > LoggingService

`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Generate a cloud architecture diagram DSL for: ${request.prompt}`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        `OpenAI API error: ${error.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const generatedDSL = data.choices[0]?.message?.content?.trim() || "";
    console.log(generatedDSL);

    return { dsl: generatedDSL };
  },
};
