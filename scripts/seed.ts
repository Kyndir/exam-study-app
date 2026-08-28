import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

interface QuestionSeed {
  id: string
  domain: string
  difficulty: 'easy' | 'medium' | 'hard'
  question_text: string
  explanation: string
  options: {
    letter: 'A' | 'B' | 'C' | 'D'
    text: string
    is_correct: boolean
    why_wrong: string | null
  }[]
}

const REFERENCES = [
  { title: 'Salesforce Administrator Exam Guide', publisher: 'Salesforce', url: 'https://trailhead.salesforce.com/credentials/administrator', date_accessed: '2024-01-01' },
  { title: 'Profiles and Permissions', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.admin_userprofiles.htm', date_accessed: '2024-01-01' },
  { title: 'User Management', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.users_mgmt_overview.htm', date_accessed: '2024-01-01' },
  { title: 'Sharing Settings Overview', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.security_sharing_owd_about.htm', date_accessed: '2024-01-01' },
  { title: 'Permission Sets', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.perm_sets_overview.htm', date_accessed: '2024-01-01' },
  { title: 'Role Hierarchy', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.security_controlling_access_using_hierarchies.htm', date_accessed: '2024-01-01' },
  { title: 'Field-Level Security', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.admin_fls.htm', date_accessed: '2024-01-01' },
  { title: 'Custom Objects', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.dev_objectedit.htm', date_accessed: '2024-01-01' },
  { title: 'Object Relationships', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.overview_of_custom_object_relationships.htm', date_accessed: '2024-01-01' },
  { title: 'Formula Fields', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.customize_formuladef.htm', date_accessed: '2024-01-01' },
  { title: 'Validation Rules', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.fields_about_field_validation.htm', date_accessed: '2024-01-01' },
  { title: 'Page Layouts', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.customize_layout.htm', date_accessed: '2024-01-01' },
  { title: 'Record Types', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.customize_recordtype.htm', date_accessed: '2024-01-01' },
  { title: 'Leads and Opportunities', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.leads.htm', date_accessed: '2024-01-01' },
  { title: 'Campaigns', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.campaigns_def.htm', date_accessed: '2024-01-01' },
  { title: 'Cases and Service Cloud', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.cases.htm', date_accessed: '2024-01-01' },
  { title: 'Escalation Rules', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.customize_caseeauto.htm', date_accessed: '2024-01-01' },
  { title: 'Reports and Dashboards', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.reports_overview.htm', date_accessed: '2024-01-01' },
  { title: 'Data Import Wizard', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.data_import_wizard.htm', date_accessed: '2024-01-01' },
  { title: 'Flow Builder', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.flow.htm', date_accessed: '2024-01-01' },
  { title: 'Workflow Rules', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.workflow_main.htm', date_accessed: '2024-01-01' },
  { title: 'Process Builder', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.process_overview.htm', date_accessed: '2024-01-01' },
  { title: 'Chatter and Collaboration', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.collab_overview.htm', date_accessed: '2024-01-01' },
  { title: 'Lightning App Builder', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.lightning_app_builder_overview.htm', date_accessed: '2024-01-01' },
  { title: 'Connected Apps', publisher: 'Salesforce Help', url: 'https://help.salesforce.com/s/articleView?id=sf.connected_app_overview.htm', date_accessed: '2024-01-01' },
]

const QUESTIONS: QuestionSeed[] = [
  // === Configuration & Setup (q001–q013) ===
  {
    id: 'q001',
    domain: 'Configuration & Setup',
    difficulty: 'medium',
    question_text: 'A new user needs access to the Accounts object but should not see Opportunities at all. What is the FIRST step an administrator should take?',
    explanation: 'Profiles control object-level access. The first step is to create or modify a Profile that removes the Opportunity object permissions (Read, Create, Edit, Delete) and sets tab visibility to Hidden. OWD controls record sharing among users who already have object access — it cannot fully hide an object from users who have it on their Profile.',
    options: [
      { letter: 'A', text: 'Set Organization-Wide Defaults for Opportunities to Private', is_correct: false, why_wrong: 'OWD controls which records a user can see, not whether they have access to the object at all. A user with Opportunity permissions on their Profile can still see some records even with Private OWD.' },
      { letter: 'B', text: 'Create a Profile without Opportunity object permissions and assign it to the user', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Create a Sharing Rule to restrict Opportunity access', is_correct: false, why_wrong: 'Sharing Rules can only extend access, not restrict it. They cannot be used to prevent a user from seeing an object.' },
      { letter: 'D', text: 'Place the user at the bottom of the Role Hierarchy', is_correct: false, why_wrong: 'The Role Hierarchy controls record visibility, not object-level access. It does not prevent users from accessing object types.' },
    ],
  },
  {
    id: 'q002',
    domain: 'Configuration & Setup',
    difficulty: 'easy',
    question_text: 'Which statement about Permission Sets is TRUE?',
    explanation: 'Permission Sets are designed to extend a user\'s access beyond what their assigned Profile allows. They can only add permissions — they cannot remove or restrict access that is granted by a Profile. This makes them useful for giving a subset of users extra capabilities without changing their Profile.',
    options: [
      { letter: 'A', text: 'A user can be assigned only one Permission Set at a time', is_correct: false, why_wrong: 'Salesforce allows multiple Permission Sets to be assigned to a single user. There is no stated limit on the number of Permission Sets per user.' },
      { letter: 'B', text: 'Permission Sets can grant but not restrict access', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Permission Sets replace Profiles entirely', is_correct: false, why_wrong: 'Every user must have exactly one Profile. Permission Sets are supplements to Profiles, not replacements.' },
      { letter: 'D', text: 'Permission Sets only work with custom objects', is_correct: false, why_wrong: 'Permission Sets work with both standard and custom objects, as well as apps, tabs, Apex classes, Visualforce pages, and more.' },
    ],
  },
  {
    id: 'q003',
    domain: 'Configuration & Setup',
    difficulty: 'medium',
    question_text: 'An administrator wants no internal user to see another user\'s Account records by default, but managers should see their team\'s Accounts via the Role Hierarchy. Which Organization-Wide Default setting should be used?',
    explanation: 'Setting the Account OWD to Private means only the record owner (and users above them in the Role Hierarchy) can view the record. This satisfies both requirements: no lateral access between peers, while managers inherit access upward through the hierarchy.',
    options: [
      { letter: 'A', text: 'Public Read/Write', is_correct: false, why_wrong: 'Public Read/Write gives all users the ability to view and edit every Account, regardless of ownership — this violates the isolation requirement.' },
      { letter: 'B', text: 'Public Read Only', is_correct: false, why_wrong: 'Public Read Only allows all internal users to see all Account records, which violates the requirement that users should not see each other\'s Accounts.' },
      { letter: 'C', text: 'Private', is_correct: true, why_wrong: null },
      { letter: 'D', text: 'Controlled by Parent', is_correct: false, why_wrong: 'Controlled by Parent is used on child objects to inherit the sharing settings of the parent object. It is not applicable to the Account object itself in this context.' },
    ],
  },
  {
    id: 'q004',
    domain: 'Configuration & Setup',
    difficulty: 'hard',
    question_text: 'Which of the following CANNOT be accomplished with a Permission Set Group?',
    explanation: 'Permission Set Groups bundle multiple Permission Sets together for easier assignment. A Muting Permission Set can be used within a group to suppress specific permissions. However, a Permission Set Group cannot override or restrict the baseline permissions set by a user\'s Profile — it can only add to them.',
    options: [
      { letter: 'A', text: 'Bundle multiple Permission Sets into one assignable unit', is_correct: false, why_wrong: 'This is the primary purpose of a Permission Set Group — to combine multiple Permission Sets so they can be assigned as one.' },
      { letter: 'B', text: 'Apply a Muting Permission Set to suppress permissions within the group', is_correct: false, why_wrong: 'Muting Permission Sets are a valid feature of Permission Set Groups, allowing specific permissions from bundled sets to be turned off within the group context.' },
      { letter: 'C', text: 'Assign the group directly to a user', is_correct: false, why_wrong: 'Permission Set Groups can be assigned directly to users, just like individual Permission Sets.' },
      { letter: 'D', text: 'Override or restrict permissions defined by the user\'s Profile', is_correct: true, why_wrong: null },
    ],
  },
  {
    id: 'q005',
    domain: 'Configuration & Setup',
    difficulty: 'easy',
    question_text: 'From which locations can Field-Level Security be configured? (Select the best single answer)',
    explanation: 'Field-Level Security (FLS) is configured at the Profile and Permission Set level. This controls whether users can see, edit, or are blocked from individual fields on an object. You can set FLS from the Profile detail page, the Permission Set detail page, or from the Field detail page in Object Manager.',
    options: [
      { letter: 'A', text: 'Object Manager only', is_correct: false, why_wrong: 'While you can access FLS from a field\'s detail page in Object Manager, you can also set it from Profiles and Permission Sets — so "only" is incorrect.' },
      { letter: 'B', text: 'Profile and Permission Set pages', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Role Hierarchy settings', is_correct: false, why_wrong: 'The Role Hierarchy controls record-level sharing, not field-level access. FLS is not configurable from the Role Hierarchy.' },
      { letter: 'D', text: 'Sharing Rules configuration', is_correct: false, why_wrong: 'Sharing Rules extend record-level access to groups of users. They have no capability to configure field-level security.' },
    ],
  },
  {
    id: 'q006',
    domain: 'Configuration & Setup',
    difficulty: 'medium',
    question_text: 'The OWD for Account is set to Private. A Sharing Rule is created to share Accounts owned by Sales Rep users with the Marketing public group. Which statement is TRUE?',
    explanation: 'Sharing Rules extend access beyond OWD settings. When OWD is Private, only the owner and their managers can see a record. A Sharing Rule then opens up that access to specific users or groups — in this case, the Marketing public group gains Read or Read/Write access to the Sales Rep-owned Accounts. The OWD remains Private for everyone else.',
    options: [
      { letter: 'A', text: 'The Sharing Rule overrides the OWD, making all Accounts visible to everyone', is_correct: false, why_wrong: 'Sharing Rules do not override OWD globally. They only extend access to the specific criteria-matching records for the defined target group.' },
      { letter: 'B', text: 'Members of the Marketing public group gain access to the specified Accounts', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Sharing Rules cannot be used when OWD is set to Private', is_correct: false, why_wrong: 'Sharing Rules are specifically designed to be used when OWD is Private or Public Read Only, to selectively extend access to specific groups.' },
      { letter: 'D', text: 'The Sharing Rule creates a copy of the Account records for the Marketing group', is_correct: false, why_wrong: 'Sharing Rules grant visibility to existing records — they do not create copies of records.' },
    ],
  },
  {
    id: 'q007',
    domain: 'Configuration & Setup',
    difficulty: 'easy',
    question_text: 'What is the maximum number of Permission Sets that can be assigned to a single user in Salesforce?',
    explanation: 'Salesforce Help documentation states there is no maximum limit on the number of Permission Sets that can be assigned to a user. In practice, assigning a very large number may affect performance, but there is no enforced platform ceiling in the way license counts are enforced.',
    options: [
      { letter: 'A', text: '1', is_correct: false, why_wrong: 'Users can have multiple Permission Sets. Only Profiles are limited to exactly one per user.' },
      { letter: 'B', text: '10', is_correct: false, why_wrong: 'There is no limit of 10. This is a common misconception.' },
      { letter: 'C', text: '1,000', is_correct: false, why_wrong: 'There is no limit of 1,000 stated in Salesforce Help. The correct answer is that no specific limit is defined.' },
      { letter: 'D', text: 'No stated limit according to Salesforce Help', is_correct: true, why_wrong: null },
    ],
  },
  {
    id: 'q008',
    domain: 'Configuration & Setup',
    difficulty: 'easy',
    question_text: 'Which statement correctly describes the difference between a Role and a Profile in Salesforce?',
    explanation: 'Profiles control what a user can do — which objects they can access, what CRUD operations they can perform, and what fields they can see (object and field permissions). Roles control what records a user can see by placing them in a hierarchy — users higher in the hierarchy can see records owned by users below them.',
    options: [
      { letter: 'A', text: 'Roles control object permissions; Profiles control record visibility', is_correct: false, why_wrong: 'This has the definitions reversed. Roles control record visibility through the hierarchy, while Profiles control object-level permissions.' },
      { letter: 'B', text: 'Profiles control object permissions; Roles control record visibility', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Both Roles and Profiles control the same settings', is_correct: false, why_wrong: 'Roles and Profiles serve distinct purposes and cannot be used interchangeably.' },
      { letter: 'D', text: 'Roles are only for external users; Profiles are only for internal users', is_correct: false, why_wrong: 'Both Roles and Profiles apply to internal users. External users (like Experience Cloud users) also have Profiles, and some Role configurations apply to them as well.' },
    ],
  },
  {
    id: 'q009',
    domain: 'Configuration & Setup',
    difficulty: 'hard',
    question_text: 'A subset of users shares the same Profile, but the administrator needs to prevent only those specific users from editing the Phone field on Contact. What is the most appropriate approach?',
    explanation: 'Field-Level Security can only restrict access at the Profile level — Permission Sets can only add permissions, not remove them. To restrict a subset of users who share the same Profile, the cleanest solution is to create a separate Profile for those users with the Phone field set to Read Only (or Hidden) at the FLS level.',
    options: [
      { letter: 'A', text: 'Create a Validation Rule that prevents those users from saving when Phone changes', is_correct: false, why_wrong: 'Validation Rules fire on save but do not truly prevent field editing — they are harder to maintain and are a workaround, not the best practice for FLS.' },
      { letter: 'B', text: 'Use a Page Layout to remove the Phone field from the layout for those users', is_correct: false, why_wrong: 'Page Layouts only hide fields from the layout — users can still edit them via API, list views, or inline editing. This is not secure field-level restriction.' },
      { letter: 'C', text: 'Create a Permission Set that sets Phone FLS to Read Only and assign it to those users', is_correct: false, why_wrong: 'Permission Sets can only grant or add permissions — they cannot restrict permissions that are already granted by a Profile. Setting Read Only in a Permission Set when the Profile allows Edit does not work.' },
      { letter: 'D', text: 'Create a separate Profile for those users with Phone FLS set to Read Only', is_correct: true, why_wrong: null },
    ],
  },
  {
    id: 'q010',
    domain: 'Configuration & Setup',
    difficulty: 'easy',
    question_text: 'What do Salesforce user licenses primarily determine?',
    explanation: 'User licenses define the baseline of Salesforce features and data that a user can access at the platform level. The permissions granted by a Profile or Permission Set cannot exceed what the assigned license allows. For example, a Salesforce Platform license user cannot access standard CRM objects like Leads even if their Profile grants it.',
    options: [
      { letter: 'A', text: 'Which page layouts a user sees', is_correct: false, why_wrong: 'Page layout assignment is controlled by the combination of Profile and Record Type, not the license type.' },
      { letter: 'B', text: 'Which features and data a user can access at the platform level', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'The maximum number of records a user can create', is_correct: false, why_wrong: 'Record limits are generally governed by org storage, not individual user licenses.' },
      { letter: 'D', text: 'Which sharing rules apply to the user\'s records', is_correct: false, why_wrong: 'Sharing rules are based on user criteria (like role or public group membership) and are not determined by license type.' },
    ],
  },
  {
    id: 'q011',
    domain: 'Configuration & Setup',
    difficulty: 'medium',
    question_text: 'An administrator wants to give one specific user temporary access to a specific Account record they normally cannot see (OWD=Private, no applicable sharing rule). What is the MOST appropriate method?',
    explanation: 'Manual Sharing (clicking the "Sharing" button on a record and adding a specific user or group) is designed exactly for one-off, ad-hoc access grants to specific records. It is the most targeted and reversible option without requiring system-wide changes.',
    options: [
      { letter: 'A', text: 'Temporarily change the Account OWD to Public Read Only', is_correct: false, why_wrong: 'Changing OWD affects all users for all Account records, which is far too broad for a single-record access need.' },
      { letter: 'B', text: 'Use Manual Sharing on the specific Account record', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Create a new Role above the record owner in the Role Hierarchy', is_correct: false, why_wrong: 'Adding a Role above the owner would also grant access to all other records owned by users below that role — too broad.' },
      { letter: 'D', text: 'Edit the user\'s Profile to add Account Read permission', is_correct: false, why_wrong: 'The user presumably already has Account object access via their Profile. The issue is record-level access, which Profiles do not control.' },
    ],
  },
  {
    id: 'q012',
    domain: 'Configuration & Setup',
    difficulty: 'easy',
    question_text: 'Which statement about the Salesforce Role Hierarchy is TRUE?',
    explanation: 'The Role Hierarchy grants record visibility upward — users in higher roles can see records owned by users in roles below them (subordinates). This works when OWD is set to Private or Public Read Only. When OWD is Public Read/Write, everyone can see everything anyway.',
    options: [
      { letter: 'A', text: 'A user\'s Role determines their Profile assignment', is_correct: false, why_wrong: 'Roles and Profiles are independent. Profiles are assigned directly to users and are not dependent on Role placement.' },
      { letter: 'B', text: 'Users in higher roles automatically see records owned by users in roles below them when OWD is Private or Public Read Only', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'The Role Hierarchy is the only mechanism for sharing records beyond OWD', is_correct: false, why_wrong: 'Sharing Rules, Manual Sharing, Teams (Account Teams, Opportunity Teams), and Apex Managed Sharing also extend record access beyond OWD.' },
      { letter: 'D', text: 'Roles replace Permission Sets for controlling user access', is_correct: false, why_wrong: 'Roles control record-level visibility, while Permission Sets control object and field permissions. They serve completely different purposes.' },
    ],
  },
  {
    id: 'q013',
    domain: 'Configuration & Setup',
    difficulty: 'medium',
    question_text: 'What is the primary purpose of a Connected App in Salesforce?',
    explanation: 'A Connected App is a framework that enables an external application to integrate with Salesforce using standard OAuth protocols (and/or SAML for SSO). It defines the authorization settings, scopes, and callback URLs so external systems can securely authenticate with Salesforce on behalf of users.',
    options: [
      { letter: 'A', text: 'To create a data integration between two Salesforce orgs', is_correct: false, why_wrong: 'While Connected Apps can be used in org-to-org integrations, they are more broadly used for any external application needing OAuth authentication with Salesforce.' },
      { letter: 'B', text: 'To allow external applications to authenticate with Salesforce using OAuth', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'To create a parent-child relationship between two custom objects', is_correct: false, why_wrong: 'Object relationships are created in Object Manager using Master-Detail or Lookup relationship fields — not Connected Apps.' },
      { letter: 'D', text: 'To bulk import data from external systems into Salesforce', is_correct: false, why_wrong: 'Data imports are performed with tools like Data Import Wizard, Data Loader, or the Bulk API — not Connected Apps.' },
    ],
  },

  // === Object Manager & Lightning App Builder (q014–q026) ===
  {
    id: 'q014',
    domain: 'Object Manager & Lightning App Builder',
    difficulty: 'easy',
    question_text: 'Which field type should you use to store a value automatically calculated from other fields on the same record?',
    explanation: 'Formula fields are read-only fields that derive their value from a formula you define, which can reference other fields on the same record (and even related records using cross-object formulas). They are recalculated dynamically and do not store a value in the database.',
    options: [
      { letter: 'A', text: 'Text', is_correct: false, why_wrong: 'Text fields store manually entered string values. They do not auto-calculate from other fields.' },
      { letter: 'B', text: 'Number', is_correct: false, why_wrong: 'Number fields store manually entered numeric values. For auto-calculation, you need a Formula field.' },
      { letter: 'C', text: 'Formula', is_correct: true, why_wrong: null },
      { letter: 'D', text: 'Roll-Up Summary', is_correct: false, why_wrong: 'Roll-Up Summary fields aggregate data from child records (e.g., COUNT, SUM), not from fields on the same record.' },
    ],
  },
  {
    id: 'q015',
    domain: 'Object Manager & Lightning App Builder',
    difficulty: 'medium',
    question_text: 'On which object can a Roll-Up Summary field be created?',
    explanation: 'Roll-Up Summary fields can only be created on the master (parent) object in a Master-Detail relationship. They aggregate values (COUNT, SUM, MIN, MAX) from the child (detail) records related to the parent. They are not available on Lookup relationship parents or on the child side of any relationship.',
    options: [
      { letter: 'A', text: 'Any object, regardless of relationship type', is_correct: false, why_wrong: 'Roll-Up Summary fields are only available on master objects in Master-Detail relationships — not on all objects.' },
      { letter: 'B', text: 'Only the master object in a Master-Detail relationship', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'The child object in a Lookup relationship', is_correct: false, why_wrong: 'Roll-Up Summary fields are not available on child objects, nor on the parent side of a Lookup relationship.' },
      { letter: 'D', text: 'Any object with more than 50 records', is_correct: false, why_wrong: 'The number of records has no bearing on Roll-Up Summary field availability. The relationship type is the determining factor.' },
    ],
  },
  {
    id: 'q016',
    domain: 'Object Manager & Lightning App Builder',
    difficulty: 'easy',
    question_text: 'What happens to child (detail) records when the master record in a Master-Detail relationship is deleted?',
    explanation: 'Master-Detail is a tight coupling between parent and child. Salesforce enforces cascade delete: when a master record is deleted, all of its related detail (child) records are automatically deleted as well. This is a key behavioral difference from Lookup relationships.',
    options: [
      { letter: 'A', text: 'The child records are reparented to another master record', is_correct: false, why_wrong: 'Reparenting in Master-Detail requires manual action and only works if the administrator has allowed it. By default, deletion cascades.' },
      { letter: 'B', text: 'The child records are automatically deleted (cascade delete)', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'The child records are moved to the Recycle Bin separately', is_correct: false, why_wrong: 'While records do go to the Recycle Bin when deleted, this option incorrectly implies they survive independently — they are cascade deleted.' },
      { letter: 'D', text: 'Nothing happens to the child records', is_correct: false, why_wrong: 'This describes Lookup relationship behavior, not Master-Detail. In Master-Detail, deletion cascades to children.' },
    ],
  },
  {
    id: 'q017',
    domain: 'Object Manager & Lightning App Builder',
    difficulty: 'medium',
    question_text: 'An Account has a Lookup relationship to a custom object "Region__c". What happens if the Region__c record being referenced is deleted?',
    explanation: 'In a Lookup relationship, the relationship is loosely coupled. When the looked-up (parent) record is deleted, the lookup field on the related record is simply cleared (set to null). The Account record itself is not deleted or affected otherwise. This is the key difference from Master-Detail cascade delete.',
    options: [
      { letter: 'A', text: 'The Account record is also deleted', is_correct: false, why_wrong: 'Cascade deletion only occurs in Master-Detail relationships. Lookup relationships do not cascade deletes to related records.' },
      { letter: 'B', text: 'The Account\'s Region__c lookup field is cleared (set to null)', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'The deletion of Region__c is prevented by a system error', is_correct: false, why_wrong: 'Lookup relationships (by default) do not block deletion of the parent record. The deletion proceeds and the field is cleared.' },
      { letter: 'D', text: 'A new Region__c record is automatically created to replace it', is_correct: false, why_wrong: 'Salesforce does not auto-create replacement records. The lookup field is simply set to null.' },
    ],
  },
  {
    id: 'q018',
    domain: 'Object Manager & Lightning App Builder',
    difficulty: 'medium',
    question_text: 'What is the maximum number of custom objects that can be created in a Salesforce Enterprise Edition org?',
    explanation: 'Enterprise Edition supports up to 200 custom objects. This limit can be increased with add-ons, but 200 is the standard platform limit for EE. Different editions have different limits: Professional Edition allows 50, Unlimited Edition allows 2,000.',
    options: [
      { letter: 'A', text: '50', is_correct: false, why_wrong: '50 is the limit for Professional Edition, not Enterprise Edition.' },
      { letter: 'B', text: '200', is_correct: true, why_wrong: null },
      { letter: 'C', text: '500', is_correct: false, why_wrong: '500 is not the standard limit for Enterprise Edition. Enterprise Edition allows 200 by default.' },
      { letter: 'D', text: 'Unlimited', is_correct: false, why_wrong: 'Even Unlimited Edition has a limit (2,000). There is no truly unlimited tier.' },
    ],
  },
  {
    id: 'q019',
    domain: 'Object Manager & Lightning App Builder',
    difficulty: 'medium',
    question_text: 'How is a many-to-many relationship typically implemented in Salesforce?',
    explanation: 'A many-to-many relationship requires a Junction Object — a custom object that sits between the two main objects. The Junction Object has two Master-Detail relationship fields, one pointing to each of the two related objects. This allows one record on either side to relate to many records on the other side.',
    options: [
      { letter: 'A', text: 'By creating two Lookup fields pointing to each object', is_correct: false, why_wrong: 'Two Lookup fields create a loose many-to-one relationship from the perspective of one object, but this is not the standard pattern for many-to-many and lacks the roll-up and cascade delete capabilities.' },
      { letter: 'B', text: 'By creating a Junction Object with two Master-Detail relationship fields', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'By using a Formula field that references records on both sides', is_correct: false, why_wrong: 'Formula fields calculate values — they do not create relationships between records.' },
      { letter: 'D', text: 'By using a Roll-Up Summary field on both objects', is_correct: false, why_wrong: 'Roll-Up Summary fields aggregate child data but do not create many-to-many relationships between two objects.' },
    ],
  },
  {
    id: 'q020',
    domain: 'Object Manager & Lightning App Builder',
    difficulty: 'medium',
    question_text: 'Which statement about Record Types is TRUE?',
    explanation: 'Record Types allow administrators to show different page layouts and picklist values to different users of the same object, based on Profile or Permission Set assignment. When a user creates a record, they may be prompted to choose a Record Type, which then determines the layout and available picklist options for that record.',
    options: [
      { letter: 'A', text: 'Record Types determine which page layout is shown to a user on a given object', is_correct: true, why_wrong: null },
      { letter: 'B', text: 'Record Types control Field-Level Security for individual fields', is_correct: false, why_wrong: 'FLS is controlled at the Profile and Permission Set level, not by Record Types.' },
      { letter: 'C', text: 'Each object can have only one Record Type', is_correct: false, why_wrong: 'Objects can have multiple Record Types (for example, a Case object might have "Technical Support," "Billing," and "General" Record Types).' },
      { letter: 'D', text: 'Record Types are only available on standard objects', is_correct: false, why_wrong: 'Record Types are available on both standard and custom objects.' },
    ],
  },
  {
    id: 'q021',
    domain: 'Object Manager & Lightning App Builder',
    difficulty: 'medium',
    question_text: 'What is a Validation Rule in Salesforce?',
    explanation: 'A Validation Rule is a formula that evaluates field values when a record is saved. If the formula returns TRUE, the record save is prevented and an error message is displayed to the user. Validation Rules help enforce data quality by ensuring records meet defined criteria before being saved.',
    options: [
      { letter: 'A', text: 'A rule that automatically populates fields when a record is created', is_correct: false, why_wrong: 'Automatically populating fields on creation is done by default field values, workflow field updates, or Flows — not Validation Rules.' },
      { letter: 'B', text: 'A formula that prevents a record from being saved if specified criteria are met', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'A rule that shares records with specific users based on field values', is_correct: false, why_wrong: 'Record sharing based on field values is done with Criteria-Based Sharing Rules, not Validation Rules.' },
      { letter: 'D', text: 'A rule that automatically sends email alerts when field values change', is_correct: false, why_wrong: 'Email alerts triggered by field changes are configured in Workflow Rules, Process Builder, or Flow — not Validation Rules.' },
    ],
  },
  {
    id: 'q022',
    domain: 'Object Manager & Lightning App Builder',
    difficulty: 'easy',
    question_text: 'What is the primary purpose of the Lightning App Builder?',
    explanation: 'The Lightning App Builder is a point-and-click tool that allows administrators to create custom pages for Lightning Experience and the Salesforce mobile app. It uses a drag-and-drop interface to assemble Lightning components into Record Pages, App Pages, or Home Pages without requiring code.',
    options: [
      { letter: 'A', text: 'To write Apex code for custom business logic', is_correct: false, why_wrong: 'Apex code is written in the Developer Console or an IDE. The Lightning App Builder is a no-code/low-code tool.' },
      { letter: 'B', text: 'To create and customize Lightning pages by dragging and dropping components', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'To configure Organization-Wide Default sharing settings', is_correct: false, why_wrong: 'OWD settings are configured in Setup under Sharing Settings, not in the Lightning App Builder.' },
      { letter: 'D', text: 'To manage user permissions and Profile assignments', is_correct: false, why_wrong: 'User permissions and Profiles are managed in Setup under Users and Profiles — not in the Lightning App Builder.' },
    ],
  },
  {
    id: 'q023',
    domain: 'Object Manager & Lightning App Builder',
    difficulty: 'hard',
    question_text: 'An administrator has a picklist field on the Opportunity object with values A, B, and C. A new Record Type is created. Which picklist values will be available by default for the new Record Type?',
    explanation: 'When a new Record Type is created, all active picklist values are included by default. Administrators can then customize which values are available for each Record Type. This is important to remember — a new Record Type starts with all values enabled, and you must actively remove unwanted ones.',
    options: [
      { letter: 'A', text: 'No values — all picklist values must be manually added to the new Record Type', is_correct: false, why_wrong: 'Salesforce includes all active values by default for a new Record Type. You do not need to manually add them.' },
      { letter: 'B', text: 'All active picklist values (A, B, and C) are included by default', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Only the default value is included', is_correct: false, why_wrong: 'All active values are included, not just the default. The default value is a separate setting from which values appear.' },
      { letter: 'D', text: 'Values are inherited from the Master Record Type only', is_correct: false, why_wrong: 'While the Master Record Type is a template, new custom Record Types get all active values and can be customized independently.' },
    ],
  },
  {
    id: 'q024',
    domain: 'Object Manager & Lightning App Builder',
    difficulty: 'medium',
    question_text: 'What is a Dynamic Form in Lightning App Builder?',
    explanation: 'Dynamic Forms allow administrators to configure field visibility and placement at the individual field level within a Lightning Record Page, rather than relying on a single Page Layout applied to all users. You can set visibility rules (using filters based on field values, user attributes, or device type) directly in Lightning App Builder.',
    options: [
      { letter: 'A', text: 'A form that auto-populates fields using data from an external system', is_correct: false, why_wrong: 'Auto-population from external systems is handled by integration tools or custom code, not Dynamic Forms.' },
      { letter: 'B', text: 'A feature that allows field visibility to be controlled directly on a Lightning Record Page using filters', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'A type of Validation Rule that shows different error messages based on user input', is_correct: false, why_wrong: 'Validation Rules are separate from Dynamic Forms. Dynamic Forms are about field layout and visibility, not validation.' },
      { letter: 'D', text: 'A page that renders differently based on the user\'s operating system', is_correct: false, why_wrong: 'While Dynamic Forms do support device-type filters (desktop vs. mobile), their primary purpose is field-level layout and visibility control.' },
    ],
  },
  {
    id: 'q025',
    domain: 'Object Manager & Lightning App Builder',
    difficulty: 'easy',
    question_text: 'Which Salesforce feature allows an administrator to display different fields and sections to different user profiles on the same record, without using Dynamic Forms?',
    explanation: 'Page Layouts control which fields, related lists, and sections appear on a record detail/edit page. By assigning different Page Layouts to different Profiles (via Record Type–Profile–Page Layout matrix), administrators can show different field arrangements to different user groups on the same object.',
    options: [
      { letter: 'A', text: 'Sharing Rules', is_correct: false, why_wrong: 'Sharing Rules control which records users can see, not which fields appear on the page layout.' },
      { letter: 'B', text: 'Page Layouts assigned per Profile and Record Type', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Apex triggers', is_correct: false, why_wrong: 'Apex triggers execute business logic on record events — they do not control which fields appear on a page layout.' },
      { letter: 'D', text: 'Roll-Up Summary fields', is_correct: false, why_wrong: 'Roll-Up Summary fields aggregate child data into a parent field. They have nothing to do with controlling layout visibility.' },
    ],
  },
  {
    id: 'q026',
    domain: 'Object Manager & Lightning App Builder',
    difficulty: 'medium',
    question_text: 'An administrator wants to add a custom component from a managed package to a Lightning App Builder page. What must be true for the component to appear in the component palette?',
    explanation: 'For a Lightning component to appear in the Lightning App Builder palette, it must be configured with the "flexipage:availableForAllPageTypes" interface (or a specific page type interface) and be properly installed. The developer of the component must have marked it as available for use in App Builder pages.',
    options: [
      { letter: 'A', text: 'The component must be written in Visualforce', is_correct: false, why_wrong: 'Lightning App Builder uses Lightning Web Components and Aura components — not Visualforce.' },
      { letter: 'B', text: 'The component must declare the appropriate interface to make it available in App Builder', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'The administrator must have the "Modify All Data" permission', is_correct: false, why_wrong: '"Modify All Data" controls data access, not whether a component appears in App Builder.' },
      { letter: 'D', text: 'The component must be deployed via a Change Set', is_correct: false, why_wrong: 'Components from managed packages are installed via AppExchange, not Change Sets. The interface declaration is what determines App Builder availability.' },
    ],
  },

  // === Sales & Marketing Applications (q027–q034) ===
  {
    id: 'q027',
    domain: 'Sales & Marketing Applications',
    difficulty: 'easy',
    question_text: 'When a Lead is converted in Salesforce, which records can be created?',
    explanation: 'Lead conversion creates one or more of the following: an Account (new or matched to existing), a Contact, and optionally an Opportunity. The administrator can configure the conversion process to allow or require Opportunity creation. The original Lead record is then marked as Converted.',
    options: [
      { letter: 'A', text: 'Account only', is_correct: false, why_wrong: 'Lead conversion typically creates an Account AND a Contact at minimum. An Opportunity is optional.' },
      { letter: 'B', text: 'Account, Contact, and optionally an Opportunity', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Contact and Opportunity only (Account is not created)', is_correct: false, why_wrong: 'An Account is always created (or matched) during Lead conversion. A Contact must be attached to an Account.' },
      { letter: 'D', text: 'Case, Contact, and Account', is_correct: false, why_wrong: 'Cases are for customer support, not Lead conversion. Lead conversion creates Account, Contact, and optionally Opportunity.' },
    ],
  },
  {
    id: 'q028',
    domain: 'Sales & Marketing Applications',
    difficulty: 'medium',
    question_text: 'What is the purpose of the Lead Assignment Rule in Salesforce?',
    explanation: 'Lead Assignment Rules automatically assign Leads to a specific user or queue based on rule criteria (such as lead source, industry, or geographic area). When a Lead is created (manually, via web-to-lead, or via import), the assignment rule fires and routes the Lead to the appropriate owner.',
    options: [
      { letter: 'A', text: 'To automatically score Leads based on engagement', is_correct: false, why_wrong: 'Lead scoring is typically done via Marketing Cloud, Pardot, or custom logic. Assignment Rules route leads to users/queues — they do not score them.' },
      { letter: 'B', text: 'To automatically route new Leads to the appropriate user or queue based on criteria', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'To send an automated email to the Lead upon creation', is_correct: false, why_wrong: 'Automated emails are sent via Email Alerts in Workflow Rules or Flows, not Assignment Rules (though assignment rules do have an option for auto-response emails).' },
      { letter: 'D', text: 'To convert Leads to Contacts automatically', is_correct: false, why_wrong: 'Lead conversion is a manual or Flow-driven process. Assignment Rules only change ownership, not the record type.' },
    ],
  },
  {
    id: 'q029',
    domain: 'Sales & Marketing Applications',
    difficulty: 'medium',
    question_text: 'A sales manager wants to prevent opportunity records from being deleted once they reach the "Closed Won" stage. What is the best way to implement this?',
    explanation: 'A Validation Rule with the formula ISDELETED() checking if the Stage is "Closed Won" would prevent deletion — but Validation Rules do not fire on delete. The correct approach is to use a Trigger or a before-delete trigger in Apex. However, for administrators without coding, using a Validation Rule on a "Deleted" checkbox or restricting the Delete button via Page Layout combined with object permissions is the typical exam answer. The most common exam answer is to remove the Delete permission from profiles for users on the Opportunity object.',
    options: [
      { letter: 'A', text: 'Create a Validation Rule that checks the Stage field on delete', is_correct: false, why_wrong: 'Validation Rules do not fire on record deletion. They only fire on insert and update (save) operations.' },
      { letter: 'B', text: 'Remove the "Delete" object permission for Opportunity from relevant Profiles', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Set the Opportunity OWD to "Read Only" for all users', is_correct: false, why_wrong: 'OWD to Read Only would prevent editing of all Opportunity records for all users — this is too broad and would break normal workflows.' },
      { letter: 'D', text: 'Create a Workflow Rule to undo any deletions', is_correct: false, why_wrong: 'Workflow Rules cannot undo or intercept record deletions. They fire on create and update only.' },
    ],
  },
  {
    id: 'q030',
    domain: 'Sales & Marketing Applications',
    difficulty: 'easy',
    question_text: 'What is the purpose of the Opportunity Path in Salesforce?',
    explanation: 'The Opportunity Path (also called Path) displays a visual representation of the stages in the Opportunity lifecycle at the top of the record page. It helps sales reps understand where they are in the process and can include guidance text and key fields for each stage. It is configured in Setup > User Interface > Path Settings.',
    options: [
      { letter: 'A', text: 'To automatically move Opportunities through stages based on time', is_correct: false, why_wrong: 'Paths are visual guides — they do not automate stage progression. Stage changes require user action or automation (Flows).' },
      { letter: 'B', text: 'To provide a visual guide of the stage-by-stage process with optional key fields and guidance text', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'To create a forecast rollup based on Opportunity stage', is_correct: false, why_wrong: 'Forecast rollups are managed in the Forecasts module using Forecast Categories linked to stages — not the Path feature.' },
      { letter: 'D', text: 'To define which users can change the Opportunity Stage field', is_correct: false, why_wrong: 'Field editing permissions are controlled by FLS on Profiles and Permission Sets. The Path is a UI guide only.' },
    ],
  },
  {
    id: 'q031',
    domain: 'Sales & Marketing Applications',
    difficulty: 'medium',
    question_text: 'Which object allows an administrator to track and measure the effectiveness of marketing initiatives in Salesforce?',
    explanation: 'The Campaign object in Salesforce is designed to track marketing initiatives such as email campaigns, events, or advertisements. Campaigns can be associated with Leads and Contacts through Campaign Members, allowing ROI tracking by comparing campaign costs against revenue from converted Opportunities.',
    options: [
      { letter: 'A', text: 'Opportunity', is_correct: false, why_wrong: 'Opportunities track sales deals. While they can be associated with Campaigns via a "Campaign Source" field, the Campaign object itself is the marketing tracking tool.' },
      { letter: 'B', text: 'Campaign', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Lead', is_correct: false, why_wrong: 'Leads represent potential customers — they can be Campaign Members, but the Campaign object is the marketing tracking mechanism.' },
      { letter: 'D', text: 'Task', is_correct: false, why_wrong: 'Tasks are activity records for to-dos and follow-ups. They are not designed for measuring marketing campaign effectiveness.' },
    ],
  },
  {
    id: 'q032',
    domain: 'Sales & Marketing Applications',
    difficulty: 'medium',
    question_text: 'An administrator wants to display Opportunities by Stage on a board-style view where reps can drag cards between columns. Which feature should they use?',
    explanation: 'Kanban view in Salesforce allows users to visualize records (such as Opportunities) organized in columns based on a field value (such as Stage). Users can drag cards between columns to update the field value, making it ideal for pipeline management.',
    options: [
      { letter: 'A', text: 'List View with filters', is_correct: false, why_wrong: 'List Views display records in a tabular format. They do not offer a card-based drag-and-drop board view.' },
      { letter: 'B', text: 'Kanban view', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Report with a summary grouping', is_correct: false, why_wrong: 'Reports display data in read-only tabular or summary formats. They do not support drag-and-drop interaction.' },
      { letter: 'D', text: 'Dashboard with a funnel chart', is_correct: false, why_wrong: 'Dashboards display aggregated data in visual charts — they do not support record-level drag-and-drop interaction.' },
    ],
  },
  {
    id: 'q033',
    domain: 'Sales & Marketing Applications',
    difficulty: 'hard',
    question_text: 'A company uses Salesforce Forecasts. A sales rep\'s manager needs to override the rep\'s individual forecast submission. What must be true to allow this?',
    explanation: 'In Collaborative Forecasting, forecast overrides flow up the hierarchy. A manager can override a subordinate\'s forecast quota or amount if they have the "Override Forecasts" permission enabled in their Profile or Permission Set. The manager must also be above the rep in the forecast hierarchy (typically the role hierarchy).',
    options: [
      { letter: 'A', text: 'The manager must have "Modify All Data" permission', is_correct: false, why_wrong: '"Modify All Data" grants broad data access but is not the specific permission required for forecast overrides. The relevant permission is "Override Forecasts."' },
      { letter: 'B', text: 'The manager must have the "Override Forecasts" permission and be above the rep in the forecast hierarchy', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'The manager must share the same Profile as the sales rep', is_correct: false, why_wrong: 'Forecast hierarchy is based on roles, not Profiles. The manager and rep can have different Profiles.' },
      { letter: 'D', text: 'The rep must first submit their forecast before the manager can override it', is_correct: false, why_wrong: 'Managers can override forecasts regardless of whether the rep has submitted — the override can happen at any time within the forecast period.' },
    ],
  },
  {
    id: 'q034',
    domain: 'Sales & Marketing Applications',
    difficulty: 'easy',
    question_text: 'What is the Web-to-Lead feature in Salesforce?',
    explanation: 'Web-to-Lead allows organizations to capture Lead information directly from a web form on their website. Salesforce generates HTML form code that the website team embeds in a web page. When a visitor submits the form, a Lead record is automatically created in Salesforce, optionally triggering assignment rules.',
    options: [
      { letter: 'A', text: 'A feature that automatically converts website visitors to Accounts', is_correct: false, why_wrong: 'Web-to-Lead creates Lead records, not Account records. Conversion to Account/Contact/Opportunity is a separate, deliberate step.' },
      { letter: 'B', text: 'A feature that generates an HTML form to capture visitor information as Leads in Salesforce', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'A tool that synchronizes Salesforce with an external marketing automation platform', is_correct: false, why_wrong: 'Synchronization with marketing platforms (like Marketing Cloud or Pardot) requires separate connectors. Web-to-Lead is a simpler, built-in form capture tool.' },
      { letter: 'D', text: 'A report that shows how many Leads came from the company website', is_correct: false, why_wrong: 'Reporting on Lead Sources is done in Salesforce Reports, not Web-to-Lead. Web-to-Lead is the form capture mechanism itself.' },
    ],
  },

  // === Service & Support Applications (q035–q041) ===
  {
    id: 'q035',
    domain: 'Service & Support Applications',
    difficulty: 'easy',
    question_text: 'What is the primary purpose of a Queue in Salesforce Service Cloud?',
    explanation: 'Queues in Salesforce are a holding area for records that can be shared among a group of users (the queue members). In Service Cloud, Cases are typically assigned to a Queue when no specific agent is designated. Queue members can then claim a Case from the queue. Queues can also be used for Leads and other objects.',
    options: [
      { letter: 'A', text: 'To automatically escalate Cases that breach SLA thresholds', is_correct: false, why_wrong: 'Case escalation based on time or conditions is handled by Escalation Rules, not Queues.' },
      { letter: 'B', text: 'To serve as a holding area for Cases (or other records) shared among a group of users', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'To set business hours for a support team', is_correct: false, why_wrong: 'Business Hours are set in Setup under Business Hours — they are not related to Queues.' },
      { letter: 'D', text: 'To report on Case resolution times across agents', is_correct: false, why_wrong: 'Case resolution time reporting is done with Salesforce Reports and Dashboards, not Queues.' },
    ],
  },
  {
    id: 'q036',
    domain: 'Service & Support Applications',
    difficulty: 'medium',
    question_text: 'An administrator needs Cases to be automatically reassigned to a manager if they are not resolved within 4 hours. Which feature should be used?',
    explanation: 'Escalation Rules allow administrators to define criteria and time-based actions for Case escalation. You can configure rules to reassign a Case to a specific user or queue, send notification emails, and set the escalation time using Business Hours. This is the appropriate tool for time-based Case routing.',
    options: [
      { letter: 'A', text: 'Assignment Rules', is_correct: false, why_wrong: 'Assignment Rules route Cases at creation time. They do not monitor Cases over time and re-assign based on age.' },
      { letter: 'B', text: 'Escalation Rules', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Workflow Rules with a time-based action', is_correct: false, why_wrong: 'While Workflow Rules support time-based actions, Escalation Rules are the purpose-built Salesforce feature for Case escalation and include Business Hours integration.' },
      { letter: 'D', text: 'Auto-Response Rules', is_correct: false, why_wrong: 'Auto-Response Rules send automated email responses to customers when a Case is created — they do not reassign Cases over time.' },
    ],
  },
  {
    id: 'q037',
    domain: 'Service & Support Applications',
    difficulty: 'easy',
    question_text: 'What does the "Email-to-Case" feature do in Salesforce?',
    explanation: 'Email-to-Case allows customers to create Cases by sending an email to a designated support email address. Salesforce automatically converts the incoming email into a Case record, with the email body becoming the Case description and subsequent email exchanges threaded as EmailMessages on the Case.',
    options: [
      { letter: 'A', text: 'Sends automated emails to customers when a Case is closed', is_correct: false, why_wrong: 'Automated emails on Case closure are sent by Auto-Response Rules or Workflow/Flow email alerts — not Email-to-Case.' },
      { letter: 'B', text: 'Creates a Case automatically when a customer sends an email to a support address', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Allows agents to send emails from within a Case record', is_correct: false, why_wrong: 'Sending emails from within a Case is handled by the Email action on the Case feed (available by default) — not specifically Email-to-Case.' },
      { letter: 'D', text: 'Routes Cases to different queues based on the email subject line', is_correct: false, why_wrong: 'Routing based on content would require Assignment Rules or case routing rules. Email-to-Case simply converts the email to a Case record.' },
    ],
  },
  {
    id: 'q038',
    domain: 'Service & Support Applications',
    difficulty: 'medium',
    question_text: 'What is a Knowledge Article in Salesforce Service Cloud?',
    explanation: 'Salesforce Knowledge provides a knowledge base where agents (and optionally customers via Experience Cloud) can create, manage, and access articles. Articles contain solutions to common problems, FAQs, or how-to guides. They can be attached to Cases to help resolve them faster and can be published to different channels (internal, customer, partner, public).',
    options: [
      { letter: 'A', text: 'An automated response email template for common Case types', is_correct: false, why_wrong: 'Email templates are separate from Knowledge Articles. Articles are searchable content in the knowledge base, not automated email templates.' },
      { letter: 'B', text: 'A document in the knowledge base containing information that helps resolve Cases', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'A custom report type for Case resolution metrics', is_correct: false, why_wrong: 'Custom report types are administrative configurations for reports — not knowledge base content.' },
      { letter: 'D', text: 'A type of record that automatically creates Cases from social media posts', is_correct: false, why_wrong: 'Social media Case creation is handled by Social Customer Service features, not Knowledge Articles.' },
    ],
  },
  {
    id: 'q039',
    domain: 'Service & Support Applications',
    difficulty: 'medium',
    question_text: 'An administrator wants to create a standard set of activities that agents must complete for every Case of a specific type. Which Salesforce feature is best suited for this?',
    explanation: 'Macros allow agents to apply a series of actions to a Case with a single click. However, for requiring a set of activities as a standard process checklist, Milestones and Entitlement Processes (from Service Cloud) or more commonly, a Checklist implemented via Flow are used. For the admin exam, the purpose-built answer for structured agent steps is usually Macros for repeated actions or a Flow for structured processes.',
    options: [
      { letter: 'A', text: 'Entitlement Processes with Milestones', is_correct: false, why_wrong: 'Entitlement Processes and Milestones track SLA adherence time-based targets — they are not checklists of activities.' },
      { letter: 'B', text: 'A macro that applies a set of predefined actions to a Case', is_correct: false, why_wrong: 'Macros automate repetitive tasks for agents but are designed for actions applied by agents, not structured required-step processes.' },
      { letter: 'C', text: 'A Screen Flow launched from the Case record that walks agents through required steps', is_correct: true, why_wrong: null },
      { letter: 'D', text: 'A Validation Rule that checks all fields are filled in', is_correct: false, why_wrong: 'Validation Rules enforce field values on save but cannot guide agents through a multi-step process.' },
    ],
  },
  {
    id: 'q040',
    domain: 'Service & Support Applications',
    difficulty: 'easy',
    question_text: 'What does an Entitlement in Salesforce Service Cloud represent?',
    explanation: 'Entitlements define the level of support a customer is entitled to receive, based on their contract or service agreement. For example, a customer might be entitled to 24/7 phone support or a 4-hour response time SLA. Entitlements are linked to Accounts or Contacts and are used to validate whether a customer is eligible for support and under what terms.',
    options: [
      { letter: 'A', text: 'A permission that allows agents to view specific Case records', is_correct: false, why_wrong: 'Agent access to Case records is controlled by sharing settings and object permissions — not Entitlements.' },
      { letter: 'B', text: 'A record that defines the level of support a customer is entitled to per their service agreement', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'An automated response sent when a Case is created', is_correct: false, why_wrong: 'Automated responses on Case creation are configured in Auto-Response Rules — not Entitlements.' },
      { letter: 'D', text: 'A milestone that must be completed within a Case SLA', is_correct: false, why_wrong: 'Milestones are time-based goals within an Entitlement Process (part of the SLA framework), but they are not the same as Entitlements themselves.' },
    ],
  },
  {
    id: 'q041',
    domain: 'Service & Support Applications',
    difficulty: 'medium',
    question_text: 'Which feature in Salesforce allows customers to create and check on their Cases through a self-service portal?',
    explanation: 'Experience Cloud (formerly Community Cloud) allows organizations to build digital portals and communities for customers, partners, and employees. A Customer Self-Service portal built on Experience Cloud gives customers the ability to log, track, and interact with their Cases directly — reducing agent workload.',
    options: [
      { letter: 'A', text: 'Email-to-Case', is_correct: false, why_wrong: 'Email-to-Case converts emails into Cases — it does not provide a visual self-service portal for customers.' },
      { letter: 'B', text: 'Experience Cloud (Customer Community)', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Live Agent Chat', is_correct: false, why_wrong: 'Live Agent enables real-time chat between customers and agents. It is a channel, not a self-service portal for Case tracking.' },
      { letter: 'D', text: 'Web-to-Case', is_correct: false, why_wrong: 'Web-to-Case captures case information from a web form, but it does not provide an authenticated portal where customers can log in and check case status.' },
    ],
  },

  // === Productivity & Collaboration (q042–q046) ===
  {
    id: 'q042',
    domain: 'Productivity & Collaboration',
    difficulty: 'easy',
    question_text: 'What is Chatter in Salesforce?',
    explanation: 'Chatter is Salesforce\'s built-in enterprise social network. It allows users to collaborate by posting updates, sharing files, following records, and @mentioning colleagues. Chatter feeds appear on records (like Accounts or Cases) and in a global feed, enabling context-rich communication.',
    options: [
      { letter: 'A', text: 'A reporting tool that aggregates activity data across users', is_correct: false, why_wrong: 'Reporting on user activity is done in Salesforce Reports. Chatter is a collaboration and communication platform.' },
      { letter: 'B', text: 'Salesforce\'s enterprise social network for collaboration and record-based communication', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'A chat tool only available to Service Cloud agents', is_correct: false, why_wrong: 'Chatter is available to all Salesforce users (with appropriate licenses), not exclusively Service Cloud agents. Live Agent/Messaging is the agent chat tool.' },
      { letter: 'D', text: 'A tool that automatically assigns tasks to users based on availability', is_correct: false, why_wrong: 'Task assignment based on availability is an Einstein or automation feature — not Chatter.' },
    ],
  },
  {
    id: 'q043',
    domain: 'Productivity & Collaboration',
    difficulty: 'easy',
    question_text: 'What is an Activity in Salesforce?',
    explanation: 'Activities in Salesforce refer to Tasks and Events. Tasks are action items or to-dos (call a customer, send a proposal) and can have due dates. Events are calendar entries with a specific start and end time (a meeting, a call). Both can be related to records like Accounts, Contacts, Leads, and Opportunities.',
    options: [
      { letter: 'A', text: 'A post in the Chatter feed', is_correct: false, why_wrong: 'Chatter posts are separate from Activities. Activities are specifically Tasks and Events in the Salesforce activity model.' },
      { letter: 'B', text: 'A Task or an Event that can be associated with records', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'An automated email sent by a Workflow Rule', is_correct: false, why_wrong: 'Automated emails are Email Alerts in the automation framework — not Activities. Activities are user-created or automation-created tasks/events.' },
      { letter: 'D', text: 'A record that tracks customer interactions with marketing campaigns', is_correct: false, why_wrong: 'Customer interactions with marketing campaigns are tracked via Campaign Member records and engagement metrics — not the Activity model.' },
    ],
  },
  {
    id: 'q044',
    domain: 'Productivity & Collaboration',
    difficulty: 'medium',
    question_text: 'What is the purpose of Salesforce Inbox?',
    explanation: 'Salesforce Inbox integrates Salesforce with email clients (Gmail and Outlook). It allows sales reps to log emails, create activities, and access Salesforce record information directly from their inbox, without switching between applications. It also offers features like email tracking and calendar sync.',
    options: [
      { letter: 'A', text: 'To manage inbound customer support emails and convert them to Cases', is_correct: false, why_wrong: 'Inbound Case creation from email is handled by Email-to-Case. Salesforce Inbox is for sales productivity integration with Gmail/Outlook.' },
      { letter: 'B', text: 'To integrate Salesforce with Gmail or Outlook for logging emails and accessing CRM data', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'To create an internal email system within Salesforce', is_correct: false, why_wrong: 'Salesforce does not replace external email clients. Inbox is an integration layer, not a standalone email application.' },
      { letter: 'D', text: 'To manage the company\'s mass email campaigns', is_correct: false, why_wrong: 'Mass email campaigns are managed via Marketing Cloud, Pardot, or the Salesforce Mass Email feature — not Salesforce Inbox.' },
    ],
  },
  {
    id: 'q045',
    domain: 'Productivity & Collaboration',
    difficulty: 'medium',
    question_text: 'A sales team wants to use Salesforce to track their daily to-do items and customer call schedules. Which two Salesforce features best support this need?',
    explanation: 'Tasks are used to track action items and to-dos (like making a call or sending a follow-up email) with due dates. Events are calendar entries for scheduled activities with a specific start and end time, such as a customer call or meeting. Together, they form the Activity model in Salesforce.',
    options: [
      { letter: 'A', text: 'Campaigns and Campaign Members', is_correct: false, why_wrong: 'Campaigns track marketing initiatives — they are not designed for tracking daily sales to-dos and call schedules.' },
      { letter: 'B', text: 'Tasks and Events', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Cases and Entitlements', is_correct: false, why_wrong: 'Cases are for customer support issues, and Entitlements define support terms — neither is appropriate for daily sales team productivity tracking.' },
      { letter: 'D', text: 'Chatter Posts and Groups', is_correct: false, why_wrong: 'Chatter is for team communication and collaboration. While useful for updates, it is not designed for tracking individual to-dos and scheduled calls with due dates.' },
    ],
  },
  {
    id: 'q046',
    domain: 'Productivity & Collaboration',
    difficulty: 'easy',
    question_text: 'What does the "Log a Call" action on a record do in Salesforce?',
    explanation: 'The "Log a Call" action creates a completed Task record associated with the current record (e.g., an Account or Contact). It captures details about a phone call — such as the call summary, duration, and outcome — and marks the Task as completed immediately, distinguishing it from future Tasks that are still pending.',
    options: [
      { letter: 'A', text: 'Initiates a phone call using Salesforce\'s built-in telephony', is_correct: false, why_wrong: 'Salesforce does not natively initiate phone calls. This requires a CTI adapter integration. "Log a Call" records details of a call that already took place.' },
      { letter: 'B', text: 'Creates a completed Task record to document a phone call interaction', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Sends a notification to the Account owner that a call was made', is_correct: false, why_wrong: '"Log a Call" creates a Task record — it does not automatically send notifications. Notifications would require additional automation.' },
      { letter: 'D', text: 'Creates an Event on the user\'s calendar for the phone call', is_correct: false, why_wrong: 'Events are for future scheduled activities on the calendar. "Log a Call" creates a completed Task, not a future Event.' },
    ],
  },

  // === Data & Analytics Management (q047–q055) ===
  {
    id: 'q047',
    domain: 'Data & Analytics Management',
    difficulty: 'easy',
    question_text: 'Which tool should an administrator use to import up to 50,000 records at once with a point-and-click wizard interface?',
    explanation: 'The Data Import Wizard is Salesforce\'s built-in, point-and-click import tool for uploading records from a CSV file. It supports up to 50,000 records per import for standard objects (Accounts, Contacts, Leads, Cases, etc.) and select custom objects. For larger imports or all objects, Data Loader is required.',
    options: [
      { letter: 'A', text: 'Data Loader', is_correct: false, why_wrong: 'Data Loader supports up to 5 million records and requires installation on a local machine. It does not have a point-and-click web wizard interface.' },
      { letter: 'B', text: 'Data Import Wizard', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Report Export', is_correct: false, why_wrong: 'Report Export exports data out of Salesforce — it does not import data into Salesforce.' },
      { letter: 'D', text: 'Workbench', is_correct: false, why_wrong: 'Workbench is a developer/admin tool for API-based data operations. It does not have a simple wizard interface for business users.' },
    ],
  },
  {
    id: 'q048',
    domain: 'Data & Analytics Management',
    difficulty: 'medium',
    question_text: 'What is the difference between a Report and a Dashboard in Salesforce?',
    explanation: 'Reports are list-based views of data that can be filtered, grouped, and summarized. They show raw data from specific objects and fields. Dashboards are visual summaries of data from multiple reports, displayed as charts, gauges, tables, and metrics on a single page. Dashboards refresh on a schedule or on demand.',
    options: [
      { letter: 'A', text: 'Reports are for internal users only; Dashboards can be shared with customers', is_correct: false, why_wrong: 'Both Reports and Dashboards can be shared with internal users and (in some configurations) Experience Cloud users. This is not the key difference.' },
      { letter: 'B', text: 'Reports show detailed or summarized data; Dashboards present visual aggregates from multiple reports', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Reports are real-time; Dashboards are always delayed by 24 hours', is_correct: false, why_wrong: 'Both Reports and Dashboards can be run in near real-time. Dashboards can be scheduled to refresh, but they are not inherently 24-hour delayed.' },
      { letter: 'D', text: 'Reports are only for administrators; Dashboards are for all users', is_correct: false, why_wrong: 'Both Reports and Dashboards can be used by all users with appropriate sharing and access settings.' },
    ],
  },
  {
    id: 'q049',
    domain: 'Data & Analytics Management',
    difficulty: 'medium',
    question_text: 'A manager wants to see a report that shows the total value of all Closed Won Opportunities, grouped by sales rep, with each rep\'s deals listed beneath their name. Which report type should be used?',
    explanation: 'A Summary report groups records by field values (in this case, by sales rep/owner). It shows subtotals and aggregates for each group, with the individual records listed under each group. This is the classic format for manager-level reporting on team performance.',
    options: [
      { letter: 'A', text: 'Tabular report', is_correct: false, why_wrong: 'Tabular reports display records in a flat list without groupings or subtotals. They cannot group by sales rep.' },
      { letter: 'B', text: 'Summary report', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Matrix report', is_correct: false, why_wrong: 'Matrix reports allow grouping by both rows and columns, creating a cross-tab view. For a simple by-rep breakdown, a Summary report is more appropriate.' },
      { letter: 'D', text: 'Joined report', is_correct: false, why_wrong: 'Joined reports combine data from multiple report types (blocks). They are more complex and not needed for a single-object grouping.' },
    ],
  },
  {
    id: 'q050',
    domain: 'Data & Analytics Management',
    difficulty: 'medium',
    question_text: 'What is the maximum number of records that the Data Loader can process in a single operation?',
    explanation: 'The Data Loader supports processing up to 5 million records in a single import or export operation. It uses the Salesforce Bulk API (v1 or v2) for large data volumes. This contrasts with the Data Import Wizard, which supports up to 50,000 records.',
    options: [
      { letter: 'A', text: '50,000', is_correct: false, why_wrong: '50,000 is the limit for the Data Import Wizard, not Data Loader.' },
      { letter: 'B', text: '1 million', is_correct: false, why_wrong: 'Data Loader supports up to 5 million records, not 1 million.' },
      { letter: 'C', text: '5 million', is_correct: true, why_wrong: null },
      { letter: 'D', text: 'Unlimited', is_correct: false, why_wrong: 'Data Loader has a stated limit of 5 million records per operation. Very large data volumes require multiple batches.' },
    ],
  },
  {
    id: 'q051',
    domain: 'Data & Analytics Management',
    difficulty: 'easy',
    question_text: 'What is a Report Folder in Salesforce?',
    explanation: 'Report Folders are containers for organizing and sharing Reports and Dashboards. Administrators and users can create folders, share them with specific users, roles, or public groups, and set access levels (Viewer, Editor, Manager). Reports must be stored in a folder to be shared — private reports are kept in personal folders.',
    options: [
      { letter: 'A', text: 'A folder on the file system where exported reports are stored', is_correct: false, why_wrong: 'Report Folders are inside Salesforce — they are not folders on a local file system.' },
      { letter: 'B', text: 'A container for organizing and controlling access to reports and dashboards', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'A filter applied to all reports within a folder', is_correct: false, why_wrong: 'Folders do not apply filters to their contents. Filters are configured within individual reports.' },
      { letter: 'D', text: 'A type of dashboard that aggregates multiple reports', is_correct: false, why_wrong: 'Dashboards aggregate report data into visual components. A Report Folder is simply an organizational and sharing container.' },
    ],
  },
  {
    id: 'q052',
    domain: 'Data & Analytics Management',
    difficulty: 'hard',
    question_text: 'An administrator runs a report and notices some records are missing. The user running the report has Read access to the object but uses the report run as "My Role\'s Users and Subordinates\' Records" setting. What is the most likely cause?',
    explanation: 'Reports can be configured to show "All Records" (if the user has View All Data or the object OWD is public) or filtered sets based on ownership criteria. "My Role\'s Users and Subordinates\' Records" only shows records owned by users in the runner\'s role and those below. If records are owned by users in other branches of the hierarchy, they will not appear.',
    options: [
      { letter: 'A', text: 'The user does not have the "Run Reports" permission', is_correct: false, why_wrong: 'If the user lacked "Run Reports" permission, they would not be able to run the report at all.' },
      { letter: 'B', text: 'Records are owned by users outside the runner\'s role hierarchy branch', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'The object\'s OWD is set to Public Read/Write', is_correct: false, why_wrong: 'Public Read/Write OWD would make more records visible, not fewer. The report filter setting is the restricting factor here.' },
      { letter: 'D', text: 'The report has too many records and is exceeding the 2,000 row display limit', is_correct: false, why_wrong: 'The 2,000 row limit affects what is displayed on screen but not what is counted in the report. Records are still included in totals even beyond the display limit.' },
    ],
  },
  {
    id: 'q053',
    domain: 'Data & Analytics Management',
    difficulty: 'medium',
    question_text: 'What is the purpose of a Custom Report Type in Salesforce?',
    explanation: 'Custom Report Types define the objects and fields available in a report, as well as the relationships between objects (like Account with or without Contacts). Standard report types have predefined object/field combinations. Custom Report Types allow administrators to create new combinations, include fields from related objects, and expose fields from child records on parent-level reports.',
    options: [
      { letter: 'A', text: 'To restrict which users can run a specific report', is_correct: false, why_wrong: 'Access to reports is controlled by folder sharing and individual user permissions — not Custom Report Types.' },
      { letter: 'B', text: 'To define a new set of objects and fields available when creating reports', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'To create a report that automatically emails results on a schedule', is_correct: false, why_wrong: 'Scheduled report subscriptions are configured on the report itself — not through Custom Report Types.' },
      { letter: 'D', text: 'To create a report that shows data from multiple orgs', is_correct: false, why_wrong: 'Cross-org reporting requires external tools or Salesforce Einstein Analytics. Standard Custom Report Types operate within one org.' },
    ],
  },
  {
    id: 'q054',
    domain: 'Data & Analytics Management',
    difficulty: 'easy',
    question_text: 'Which field type on a report allows an administrator to see SUM, COUNT, MIN, and MAX aggregates?',
    explanation: 'In Summary and Matrix reports, numeric field columns can display aggregates such as SUM, COUNT, MIN, MAX, and AVERAGE. These aggregates appear at the group level or at the grand total level. The column must be of a numeric type (Currency, Number, Percent) or Date for MIN/MAX.',
    options: [
      { letter: 'A', text: 'Text fields', is_correct: false, why_wrong: 'Text fields cannot be aggregated with SUM, COUNT, MIN, or MAX in Salesforce reports.' },
      { letter: 'B', text: 'Numeric fields (Currency, Number, Percent)', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Formula fields only', is_correct: false, why_wrong: 'Both standard numeric fields and numeric formula fields can be aggregated. Aggregation is not limited to formula fields.' },
      { letter: 'D', text: 'Lookup fields', is_correct: false, why_wrong: 'Lookup fields show related record names (text) and cannot be numerically aggregated.' },
    ],
  },
  {
    id: 'q055',
    domain: 'Data & Analytics Management',
    difficulty: 'medium',
    question_text: 'An administrator needs to identify and merge duplicate Contact records. Which Salesforce tool is designed for this purpose?',
    explanation: 'Duplicate Management in Salesforce uses Duplicate Rules and Matching Rules. When a potential duplicate is detected, Salesforce shows a warning. Administrators can also use the Potential Duplicates component on a record and the Salesforce Duplicate Jobs feature (available in Lightning) to find and merge duplicates in bulk. The Merge Contacts function is also accessible from the Contact record itself.',
    options: [
      { letter: 'A', text: 'Data Loader with a filter for duplicate email addresses', is_correct: false, why_wrong: 'Data Loader is used for bulk data operations — it does not have built-in deduplication or merge capabilities.' },
      { letter: 'B', text: 'Duplicate Rules and Matching Rules, with the Merge Contacts functionality', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Workflow Rules triggered on Contact creation', is_correct: false, why_wrong: 'Workflow Rules can alert on duplicates (via email), but they cannot detect or merge duplicates themselves.' },
      { letter: 'D', text: 'A custom Validation Rule that prevents saving duplicate email addresses', is_correct: false, why_wrong: 'A Validation Rule can prevent future duplicates but cannot find and merge existing ones.' },
    ],
  },

  // === Workflow/Process Automation (q056–q065) ===
  {
    id: 'q056',
    domain: 'Workflow/Process Automation',
    difficulty: 'easy',
    question_text: 'Which Salesforce automation tool is considered the successor to both Workflow Rules and Process Builder?',
    explanation: 'Salesforce Flow Builder (specifically Record-Triggered Flows) is Salesforce\'s recommended automation platform going forward, designed to replace both Workflow Rules and Process Builder. Salesforce has announced the retirement of Workflow Rules and Process Builder in favor of Flow Builder, which is more powerful and supports both record-triggered and user-initiated automation.',
    options: [
      { letter: 'A', text: 'Apex triggers', is_correct: false, why_wrong: 'Apex triggers are code-based automation for complex scenarios. Flow Builder is the no-code/low-code successor to Workflow Rules and Process Builder.' },
      { letter: 'B', text: 'Flow Builder (Record-Triggered Flows)', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Assignment Rules', is_correct: false, why_wrong: 'Assignment Rules are specifically for routing Leads and Cases — they are not a general-purpose automation tool and are not the successor to Workflow Rules.' },
      { letter: 'D', text: 'Approval Processes', is_correct: false, why_wrong: 'Approval Processes are for multi-step human approval workflows. They are not the successor to Workflow Rules or Process Builder.' },
    ],
  },
  {
    id: 'q057',
    domain: 'Workflow/Process Automation',
    difficulty: 'medium',
    question_text: 'What actions can a Workflow Rule perform? (Select the best single answer)',
    explanation: 'Workflow Rules can trigger four types of actions: Field Updates (change a field value on the record or related record), Email Alerts (send an email using a template), Tasks (create a Task assigned to a user), and Outbound Messages (send a SOAP message to an external endpoint). These can be immediate or time-based (via Time-Based Workflow).',
    options: [
      { letter: 'A', text: 'Create a new record on any object', is_correct: false, why_wrong: 'Workflow Rules cannot create new records on other objects. Record creation requires Process Builder or Flow.' },
      { letter: 'B', text: 'Field Updates, Email Alerts, Tasks, and Outbound Messages', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Update records on any related object and call Apex code', is_correct: false, why_wrong: 'Workflow Rules have limited cross-object field update capability and cannot directly call Apex. Process Builder and Flow support these scenarios.' },
      { letter: 'D', text: 'Post to Chatter and send push notifications', is_correct: false, why_wrong: 'Chatter posts and push notifications are supported in Process Builder and Flow, not standard Workflow Rules.' },
    ],
  },
  {
    id: 'q058',
    domain: 'Workflow/Process Automation',
    difficulty: 'medium',
    question_text: 'An administrator needs to send an approval request to a manager when an Opportunity discount exceeds 20%. Which Salesforce feature is best suited for this?',
    explanation: 'Approval Processes in Salesforce are purpose-built for multi-step human review workflows. When triggered (manually or via entry criteria), they route a record to specified approvers and execute approval or rejection actions. They are the standard tool for scenarios requiring human sign-off on record criteria.',
    options: [
      { letter: 'A', text: 'Workflow Rule with an Email Alert', is_correct: false, why_wrong: 'A Workflow Rule can send an email notification, but it does not create a formal approval loop with approve/reject actions and record locking.' },
      { letter: 'B', text: 'Approval Process', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Record-Triggered Flow', is_correct: false, why_wrong: 'A Flow could send an email or post to Chatter, but it does not natively support the approve/reject workflow with record locking and delegated approvers.' },
      { letter: 'D', text: 'Validation Rule', is_correct: false, why_wrong: 'A Validation Rule can prevent saving with a discount over 20%, but it cannot route the record to a manager for approval.' },
    ],
  },
  {
    id: 'q059',
    domain: 'Workflow/Process Automation',
    difficulty: 'medium',
    question_text: 'Which type of Flow is used to guide a user through a series of screens to collect input and perform actions?',
    explanation: 'Screen Flows display a series of interactive screens to the user, collecting input along the way. They can create/update records, call Apex, send emails, and more based on the user\'s input. Screen Flows are launched from Lightning Pages, Experience Cloud sites, Visualforce pages, or Action buttons.',
    options: [
      { letter: 'A', text: 'Record-Triggered Flow', is_correct: false, why_wrong: 'Record-Triggered Flows run automatically in the background when a record is created, updated, or deleted — they do not display screens to users.' },
      { letter: 'B', text: 'Screen Flow', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Scheduled Flow', is_correct: false, why_wrong: 'Scheduled Flows (Schedule-Triggered Flows) run at a specified time or interval without user interaction — they do not present screens.' },
      { letter: 'D', text: 'Autolaunched Flow', is_correct: false, why_wrong: 'Autolaunched Flows run automatically without a user interface — they have no screens and are typically called by other Flows, Apex, or Process Builder.' },
    ],
  },
  {
    id: 'q060',
    domain: 'Workflow/Process Automation',
    difficulty: 'hard',
    question_text: 'A Record-Triggered Flow runs "After the record is saved." An administrator wants the Flow to create a related child record. Which execution mode should be used?',
    explanation: 'When a Record-Triggered Flow is configured to run "After the record is saved," it executes in a deferred (asynchronous) context that has already committed the triggering record. This is the appropriate mode for creating related records (DML operations on other objects) because the triggering transaction is complete. Running "Before" the record is saved is for modifying the record itself without DML.',
    options: [
      { letter: 'A', text: 'Fast Field Update (Before the record is saved)', is_correct: false, why_wrong: 'Before-save flows are for modifying the triggering record\'s own fields without using DML. They cannot create new records on other objects.' },
      { letter: 'B', text: 'Actions and Related Records (After the record is saved)', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'Scheduled Path', is_correct: false, why_wrong: 'Scheduled Paths run at a future time relative to the record\'s creation or field value — they are not for immediate post-save record creation.' },
      { letter: 'D', text: 'Screen Flow triggered from a button', is_correct: false, why_wrong: 'A Screen Flow requires user interaction. The requirement is for automatic child record creation, not user-initiated.' },
    ],
  },
  {
    id: 'q061',
    domain: 'Workflow/Process Automation',
    difficulty: 'medium',
    question_text: 'What is an Approval Process step in Salesforce?',
    explanation: 'An Approval Step defines who the approver is for that step in the process (specific user, dynamically determined user like the record owner\'s manager, or a queue). Each step can have entry criteria to determine if it applies. Multi-step Approval Processes chain steps together, with each step having its own approver(s) and approve/reject/recall actions.',
    options: [
      { letter: 'A', text: 'A Validation Rule that fires when an approval request is submitted', is_correct: false, why_wrong: 'Validation Rules are separate from Approval Processes. Approval steps define approvers and actions, not field validation.' },
      { letter: 'B', text: 'A defined approver node in the process that specifies who reviews the record at that stage', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'An automated email sent when a record enters the approval queue', is_correct: false, why_wrong: 'The initial submission email is configured in the Approval Process entry, not as an individual Approval Step.' },
      { letter: 'D', text: 'A formula that calculates the discount amount requiring approval', is_correct: false, why_wrong: 'Formulas or criteria define when the Approval Process is triggered (entry criteria) — the step itself defines the approver and resulting actions.' },
    ],
  },
  {
    id: 'q062',
    domain: 'Workflow/Process Automation',
    difficulty: 'medium',
    question_text: 'What is the recommended way to automatically update a field on an Account when a related Opportunity is marked as Closed Won?',
    explanation: 'A Record-Triggered Flow set to fire when an Opportunity is updated (with a condition that Stage equals "Closed Won") can traverse the relationship to the parent Account and update a field. This is the modern, recommended approach using Flow Builder. Previously, cross-object field updates (child to parent) required Apex triggers; Process Builder could do this but is being retired.',
    options: [
      { letter: 'A', text: 'A Workflow Rule with a cross-object field update', is_correct: false, why_wrong: 'Standard Workflow Rules support cross-object field updates in limited scenarios (child to parent). However, Workflow Rules are being retired in favor of Flow.' },
      { letter: 'B', text: 'A Record-Triggered Flow on Opportunity that updates the related Account', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'A Roll-Up Summary field on the Account', is_correct: false, why_wrong: 'Roll-Up Summary fields aggregate values (SUM, COUNT, etc.) from child records — they do not set arbitrary field values based on stage criteria.' },
      { letter: 'D', text: 'A Validation Rule on the Account that checks Opportunity stage', is_correct: false, why_wrong: 'Validation Rules prevent record saves based on conditions — they do not update field values.' },
    ],
  },
  {
    id: 'q063',
    domain: 'Workflow/Process Automation',
    difficulty: 'hard',
    question_text: 'An administrator builds a Flow that queries many records and performs DML operations in a loop. What common issue might this cause?',
    explanation: 'Salesforce enforces Governor Limits to ensure fair resource usage across the platform. In Flows, performing SOQL queries or DML operations inside loops can quickly exceed limits like "too many SOQL queries (100)" or "too many DML statements (150)." Best practice is to collect data first (using a collection or Get Records outside the loop), then process in bulk outside the loop.',
    options: [
      { letter: 'A', text: 'The Flow will run indefinitely until manually stopped', is_correct: false, why_wrong: 'Flows have a built-in limit on the number of elements executed per interview (currently 2,000). They do not run indefinitely.' },
      { letter: 'B', text: 'Governor Limit errors due to SOQL queries or DML operations inside a loop', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'The Flow will silently skip records without throwing any error', is_correct: false, why_wrong: 'Governor Limit violations cause explicit errors/faults, not silent skipping.' },
      { letter: 'D', text: 'The Flow will lock all records being processed, preventing other users from editing', is_correct: false, why_wrong: 'Flows do not lock records in the way that some database operations do. Record-level locking in Salesforce is a transactional concern managed by the platform.' },
    ],
  },
  {
    id: 'q064',
    domain: 'Workflow/Process Automation',
    difficulty: 'medium',
    question_text: 'What happens to a record\'s approval status if the assigned approver is unavailable and no delegate has been set?',
    explanation: 'If the approver is unavailable (e.g., out of office) and has not set a delegated approver, the approval request remains pending in their queue until they act on it. Administrators can reassign the approval request from Setup, or the approver can set a delegated approver in advance. This is why setting up delegated approvers is a recommended best practice.',
    options: [
      { letter: 'A', text: 'The system automatically escalates to the approver\'s manager', is_correct: false, why_wrong: 'Approval Processes do not automatically escalate to a manager if the approver is unavailable. This behavior must be explicitly configured.' },
      { letter: 'B', text: 'The approval request remains pending until the approver acts or an admin reassigns it', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'The record is automatically approved after a configurable timeout', is_correct: false, why_wrong: 'There is no built-in timeout that auto-approves a record. The request stays pending indefinitely without explicit action.' },
      { letter: 'D', text: 'The record is rejected automatically', is_correct: false, why_wrong: 'Unavailability of an approver does not trigger automatic rejection. The request simply stays pending.' },
    ],
  },
  {
    id: 'q065',
    domain: 'Workflow/Process Automation',
    difficulty: 'hard',
    question_text: 'An administrator needs to create a complex automation that: (1) queries a list of related records, (2) sends different emails based on field values, and (3) creates a follow-up Task. Workflow Rules cannot accomplish all three steps. Which tool is most appropriate?',
    explanation: 'Flow Builder is the most capable declarative automation tool for complex multi-step processes. It can query records (Get Records), apply conditional logic (Decision elements), send emails (Email Alert actions or Send Email core actions), and create Tasks (Create Records). Flow Builder replaces the more limited Workflow Rules and Process Builder for complex automation.',
    options: [
      { letter: 'A', text: 'Multiple chained Workflow Rules', is_correct: false, why_wrong: 'Chaining Workflow Rules is complex, limited, and not recommended. Workflow Rules also cannot query related record lists or perform conditional multi-step logic.' },
      { letter: 'B', text: 'Flow Builder with a Record-Triggered or Scheduled Flow', is_correct: true, why_wrong: null },
      { letter: 'C', text: 'An Approval Process with multiple steps', is_correct: false, why_wrong: 'Approval Processes are for human review workflows. They do not query records conditionally or create Tasks based on dynamic field-value logic.' },
      { letter: 'D', text: 'Assignment Rules combined with Escalation Rules', is_correct: false, why_wrong: 'Assignment and Escalation Rules are specific to Lead/Case routing. They cannot query records, send conditional emails, or create Tasks in a general automation context.' },
    ],
  },
]

async function seedReferences() {
  console.log('Seeding references...')

  // Check if references already exist
  const { data: existing } = await supabase.from('references').select('id').limit(1)
  if (existing && existing.length > 0) {
    console.log('References already exist, skipping...')
    const { data: refs } = await supabase.from('references').select('id').order('id')
    return refs?.map((r) => r.id) ?? []
  }

  const { data, error } = await supabase
    .from('references')
    .insert(
      REFERENCES.map((ref) => ({
        title: ref.title,
        publisher: ref.publisher,
        url: ref.url,
        date_accessed: ref.date_accessed,
      }))
    )
    .select('id')

  if (error) {
    console.error('Error seeding references:', error)
    throw error
  }

  console.log(`Seeded ${data?.length ?? 0} references`)
  return data?.map((r) => r.id) ?? []
}

async function seedQuestions(referenceIds: number[]) {
  console.log('Seeding questions...')

  for (const q of QUESTIONS) {
    // Check if question already exists
    const { data: existing } = await supabase
      .from('questions')
      .select('id')
      .eq('id', q.id)
      .single()

    if (existing) {
      console.log(`Question ${q.id} already exists, skipping...`)
      continue
    }

    // Insert question
    const { error: qErr } = await supabase.from('questions').insert({
      id: q.id,
      question_text: q.question_text,
      domain: q.domain,
      difficulty: q.difficulty,
      explanation: q.explanation,
    })

    if (qErr) {
      console.error(`Error inserting question ${q.id}:`, qErr)
      throw qErr
    }

    // Insert answer options
    const { error: optErr } = await supabase.from('answer_options').insert(
      q.options.map((opt) => ({
        question_id: q.id,
        option_letter: opt.letter,
        option_text: opt.text,
        is_correct: opt.is_correct,
        why_wrong: opt.why_wrong,
      }))
    )

    if (optErr) {
      console.error(`Error inserting options for ${q.id}:`, optErr)
      throw optErr
    }

    // Assign 2-3 references to each question based on domain
    const domainRefMap: Record<string, number[]> = {
      'Configuration & Setup': [0, 1, 2, 3, 4, 5, 6],
      'Object Manager & Lightning App Builder': [7, 8, 9, 10, 11, 12, 23],
      'Sales & Marketing Applications': [13, 14],
      'Service & Support Applications': [15, 16],
      'Productivity & Collaboration': [22],
      'Data & Analytics Management': [17, 18],
      'Workflow/Process Automation': [19, 20, 21],
    }

    const domainRefs = domainRefMap[q.domain] ?? [0, 1]
    const selectedRefIndexes = domainRefs.slice(0, 2)
    const selectedRefIds = selectedRefIndexes.map((i) => referenceIds[i]).filter(Boolean)

    if (selectedRefIds.length > 0) {
      const { error: refErr } = await supabase.from('question_references').insert(
        selectedRefIds.map((refId) => ({
          question_id: q.id,
          reference_id: refId,
        }))
      )

      if (refErr) {
        console.error(`Error inserting references for ${q.id}:`, refErr)
        // Non-fatal — continue
      }
    }

    console.log(`Seeded question ${q.id} (${q.domain})`)
  }
}

async function main() {
  console.log('Starting seed...')
  console.log(`Using Supabase URL: ${SUPABASE_URL}`)
  console.log(`Using key type: ${process.env.SUPABASE_SERVICE_KEY ? 'service_role' : 'anon (WARNING: may fail due to RLS)'}`)

  const referenceIds = await seedReferences()
  await seedQuestions(referenceIds as number[])

  console.log('\n✅ Seed complete!')
  console.log(`Seeded ${QUESTIONS.length} questions across 7 domains`)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
