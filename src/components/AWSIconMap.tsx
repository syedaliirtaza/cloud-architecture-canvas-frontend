import EC2Icon from "@/components/aws-icons/assets/EC2.svg";
import APIGateway from "@/components/aws-icons/assets/API-Gateway.svg";
import AppRunner from "@/components/aws-icons/assets/App-Runner.svg";
import AppFlow from "@/components/aws-icons/assets/AppFlow.svg";
import ApplicationAutoScaling from "@/components/aws-icons/assets/Application-Auto-Scaling.svg";
import AppSync from "@/components/aws-icons/assets/AppSync.svg";
import Aurora from "@/components/aws-icons/assets/Aurora.svg";
import Batch from "@/components/aws-icons/assets/Batch.svg";
import Chime from "@/components/aws-icons/assets/Chime.svg";
import CloudSearch from "@/components/aws-icons/assets/CloudSearch.svg";
import CodeGuru from "@/components/aws-icons/assets/CodeGuru.svg";
import ComputeOptimizer from "@/components/aws-icons/assets/Compute-Optimizer.svg";
import Connect from "@/components/aws-icons/assets/Connect.svg";
import DataPipeline from "@/components/aws-icons/assets/Data-Pipeline.svg";
import DatabaseMigrationService from "@/components/aws-icons/assets/Database-Migration-Service.svg";
import DataZone from "@/components/aws-icons/assets/DataZone.svg";
import DeepComposer from "@/components/aws-icons/assets/DeepComposer.svg";
import DevOpsGuru from "@/components/aws-icons/assets/DevOps-Guru.svg";
import DocumentDB from "@/components/aws-icons/assets/DocumentDB.svg";
import DynamoDB from "@/components/aws-icons/assets/DynamoDB.svg";
import EC2AutoScaling from "@/components/aws-icons/assets/EC2-Auto-Scaling.svg";
import EC2ImageBuilder from "@/components/aws-icons/assets/EC2-Image-Builder.svg";
import ECSAnywhere from "@/components/aws-icons/assets/ECS-Anywhere.svg";
import EFS from "@/components/aws-icons/assets/EFS.svg";
import EKSAnywhere from "@/components/aws-icons/assets/EKS-Anywhere.svg";
import EKSCloud from "@/components/aws-icons/assets/EKS-Cloud.svg";
import EKSDistro from "@/components/aws-icons/assets/EKS-Distro.svg";
import ElasticBeanstalk from "@/components/aws-icons/assets/Elastic-Beanstalk.svg";
import ElasticBlockStore from "@/components/aws-icons/assets/Elastic-Block-Store.svg";
import ElasticContainerRegistry from "@/components/aws-icons/assets/Elastic-Container-Registry.svg";
import ElasticContainerService from "@/components/aws-icons/assets/Elastic-Container-Service.svg";
import ElasticFabricAdapter from "@/components/aws-icons/assets/Elastic-Fabric-Adapter.svg";
import ElasticKubernetesService from "@/components/aws-icons/assets/Elastic-Kubernetes-Service.svg";
import ElastiCache from "@/components/aws-icons/assets/ElastiCache.svg";
import EventBridge from "@/components/aws-icons/assets/EventBridge.svg";
import Fargate from "@/components/aws-icons/assets/Fargate.svg";
import Glue from "@/components/aws-icons/assets/Glue.svg";
import Keyspaces from "@/components/aws-icons/assets/Keyspaces.svg";
import KinesisDataAnalytics from "@/components/aws-icons/assets/Kinesis-Data-Analytics.svg";
import KinesisDataStreams from "@/components/aws-icons/assets/Kinesis-Data-Streams.svg";
import KinesisFirehose from "@/components/aws-icons/assets/Kinesis-Firehose.svg";
import KinesisVideoStreams from "@/components/aws-icons/assets/Kinesis-Video-Streams.svg";
import Kinesis from "@/components/aws-icons/assets/Kinesis.svg";
import LakeFormation from "@/components/aws-icons/assets/Lake-Formation.svg";
import Lambda from "@/components/aws-icons/assets/Lambda.svg";
import MemoryDBForRedis from "@/components/aws-icons/assets/MemoryDB-for-Redis.svg";
import MQ from "@/components/aws-icons/assets/MQ.svg";
import Neptune from "@/components/aws-icons/assets/Neptune.svg";
import OpenSearchService from "@/components/aws-icons/assets/OpenSearch-Service.svg";
import QuickSight from "@/components/aws-icons/assets/QuickSight.svg";
import RDSonVMware from "@/components/aws-icons/assets/RDS-on-VMware.svg";
import RDS from "@/components/aws-icons/assets/RDS.svg";
import RedHatOpenShiftServiceOnAWS from "@/components/aws-icons/assets/Red-Hat-OpenShift-Service-on-AWS.svg";
import Redshift from "@/components/aws-icons/assets/Redshift.svg";
import SageMakerStudioLab from "@/components/aws-icons/assets/SageMaker-Studio-Lab.svg";
import SageMaker from "@/components/aws-icons/assets/SageMaker.svg";
import SimpleQueueService from "@/components/aws-icons/assets/Simple-Queue-Service.svg";
import SimpleStorageService from "@/components/aws-icons/assets/Simple-Storage-Service.svg";
import Snowball from "@/components/aws-icons/assets/Snowball.svg";
import StepFunctions from "@/components/aws-icons/assets/Step-Functions.svg";
import StorageGateway from "@/components/aws-icons/assets/Storage-Gateway.svg";
import TensorFlowOnAWS from "@/components/aws-icons/assets/TensorFlow-on-AWS.svg";
import Timestream from "@/components/aws-icons/assets/Timestream.svg";
import TorchServe from "@/components/aws-icons/assets/TorchServe.svg";
import WorkDocs from "@/components/aws-icons/assets/WorkDocs.svg";
import WorkMail from "@/components/aws-icons/assets/WorkMail.svg";

import type { AWSIconType } from "@/lib/types";

export const AWS_ICONS: Record<AWSIconType, { icon: string; label: string }> = {
  EC2Icon: { icon: EC2Icon, label: "EC2" },
  APIGateway: { icon: APIGateway, label: "API Gateway" },
  AppRunner: { icon: AppRunner, label: "App Runner" },
  AppFlow: { icon: AppFlow, label: "AppFlow" },
  ApplicationAutoScaling: {
    icon: ApplicationAutoScaling,
    label: "Application Auto Scaling",
  },
  AppSync: { icon: AppSync, label: "AppSync" },
  Aurora: { icon: Aurora, label: "Aurora" },
  Batch: { icon: Batch, label: "Batch" },
  Chime: { icon: Chime, label: "Chime" },
  CloudSearch: { icon: CloudSearch, label: "CloudSearch" },
  CodeGuru: { icon: CodeGuru, label: "CodeGuru" },
  ComputeOptimizer: { icon: ComputeOptimizer, label: "Compute Optimizer" },
  Connect: { icon: Connect, label: "Connect" },
  DataPipeline: { icon: DataPipeline, label: "Data Pipeline" },
  DatabaseMigrationService: {
    icon: DatabaseMigrationService,
    label: "Database Migration Service",
  },
  DataZone: { icon: DataZone, label: "DataZone" },
  DeepComposer: { icon: DeepComposer, label: "DeepComposer" },
  DevOpsGuru: { icon: DevOpsGuru, label: "DevOps Guru" },
  DocumentDB: { icon: DocumentDB, label: "DocumentDB" },
  DynamoDB: { icon: DynamoDB, label: "DynamoDB" },
  EC2AutoScaling: { icon: EC2AutoScaling, label: "EC2 Auto Scaling" },
  EC2ImageBuilder: { icon: EC2ImageBuilder, label: "EC2 Image Builder" },
  ECSAnywhere: { icon: ECSAnywhere, label: "ECS Anywhere" },
  EFS: { icon: EFS, label: "EFS" },
  EKSAnywhere: { icon: EKSAnywhere, label: "EKS Anywhere" },
  EKSCloud: { icon: EKSCloud, label: "EKS Cloud" },
  EKSDistro: { icon: EKSDistro, label: "EKS Distro" },
  ElasticBeanstalk: { icon: ElasticBeanstalk, label: "Elastic Beanstalk" },
  ElasticBlockStore: { icon: ElasticBlockStore, label: "Elastic Block Store" },
  ElasticContainerRegistry: {
    icon: ElasticContainerRegistry,
    label: "Elastic Container Registry",
  },
  ElasticContainerService: {
    icon: ElasticContainerService,
    label: "Elastic Container Service",
  },
  ElasticFabricAdapter: {
    icon: ElasticFabricAdapter,
    label: "Elastic Fabric Adapter",
  },
  ElasticKubernetesService: {
    icon: ElasticKubernetesService,
    label: "Elastic Kubernetes Service",
  },
  ElastiCache: { icon: ElastiCache, label: "ElastiCache" },
  EventBridge: { icon: EventBridge, label: "EventBridge" },
  Fargate: { icon: Fargate, label: "Fargate" },
  Glue: { icon: Glue, label: "Glue" },
  Keyspaces: { icon: Keyspaces, label: "Keyspaces" },
  KinesisDataAnalytics: {
    icon: KinesisDataAnalytics,
    label: "Kinesis Data Analytics",
  },
  KinesisDataStreams: {
    icon: KinesisDataStreams,
    label: "Kinesis Data Streams",
  },
  KinesisFirehose: { icon: KinesisFirehose, label: "Kinesis Firehose" },
  KinesisVideoStreams: {
    icon: KinesisVideoStreams,
    label: "Kinesis Video Streams",
  },
  Kinesis: { icon: Kinesis, label: "Kinesis" },
  LakeFormation: { icon: LakeFormation, label: "Lake Formation" },
  Lambda: { icon: Lambda, label: "Lambda" },
  MemoryDBForRedis: { icon: MemoryDBForRedis, label: "MemoryDB for Redis" },
  MQ: { icon: MQ, label: "MQ" },
  Neptune: { icon: Neptune, label: "Neptune" },
  OpenSearchService: { icon: OpenSearchService, label: "OpenSearch Service" },
  QuickSight: { icon: QuickSight, label: "QuickSight" },
  RDSonVMware: { icon: RDSonVMware, label: "RDS on VMware" },
  RDS: { icon: RDS, label: "RDS" },
  RedHatOpenShiftServiceOnAWS: {
    icon: RedHatOpenShiftServiceOnAWS,
    label: "Red Hat OpenShift Service on AWS",
  },
  Redshift: { icon: Redshift, label: "Redshift" },
  SageMakerStudioLab: {
    icon: SageMakerStudioLab,
    label: "SageMaker Studio Lab",
  },
  SageMaker: { icon: SageMaker, label: "SageMaker" },
  SimpleQueueService: {
    icon: SimpleQueueService,
    label: "Simple Queue Service",
  },
  SimpleStorageService: {
    icon: SimpleStorageService,
    label: "Simple Storage Service",
  },
  Snowball: { icon: Snowball, label: "Snowball" },
  StepFunctions: { icon: StepFunctions, label: "Step Functions" },
  StorageGateway: { icon: StorageGateway, label: "Storage Gateway" },
  TensorFlowOnAWS: { icon: TensorFlowOnAWS, label: "TensorFlow on AWS" },
  Timestream: { icon: Timestream, label: "Timestream" },
  TorchServe: { icon: TorchServe, label: "TorchServe" },
  WorkDocs: { icon: WorkDocs, label: "WorkDocs" },
  WorkMail: { icon: WorkMail, label: "WorkMail" },
};
