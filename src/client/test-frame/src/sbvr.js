define(['SBVRParser', 'SBVR2SQL', 'sbvr-compiler/LF2AbstractSQLPrep'], function(SBVRParser, SBVR2SQL, LF2AbstractSQLPrep) {
	var testModel = [
		[
			'T: person',
			[ "term", "person", [] ],
			[ "term", "person", [ [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "person" ] ] ],
			[ "term", "person", "person", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"person\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"person\";" ]
		], [
			'T: educational institution',
			[ "term", "educational institution", [] ],
			[ "term", "educational institution", [ [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "educational_institution" ] ] ],
			[ "term", "educational_institution", "educational institution", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"educational_institution\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"educational_institution\";" ] 
		], [
			'--Test comment',
			'Test comment',
			'match failed',
			'match failed',
		], [
			'--Test comment Term: With ignored term',
			'Test comment Term: With ignored term',
			'match failed',
			'match failed',
		], [
			'F: person is enrolled in educational institution --Ignored comment',
			[ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ], [] ],
			[ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ], [ [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "person-is_enrolled_in-educational_institution" ] ] ],
			[ "fcTp", "person-is_enrolled_in-educational_institution", "person is enrolled in educational_institution", [ [ "ForeignKey", "person_id", "person", [ "person", "id", "name" ] ], [ "ForeignKey", "educational_institution_id", "educational_institution", [ "educational_institution", "id", "name" ] ] ], "CREATE TABLE \"person-is_enrolled_in-educational_institution\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"person_id\" INTEGER, \"educational_institution_id\" INTEGER, FOREIGN KEY (\"person_id\") REFERENCES \"person\"(\"id\"), FOREIGN KEY (\"educational_institution_id\") REFERENCES \"educational_institution\"(\"id\"))", "DROP TABLE \"person-is_enrolled_in-educational_institution\";", [ [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ] ]
		], [
			'F: person has age',
			[ "fcTp", [ "term", "person" ], [ "verb", "has age" ], [] ],
			[ "fcTp", [ "term", "person" ], [ "verb", "has age" ], [ [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "person-has_age" ] ] ],
			[ "fcTp", "person-has_age", "person has age", [ [ "ForeignKey", "person_id", "person", [ "person", "id", "name" ] ] ], "CREATE TABLE \"person-has_age\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"person_id\" INTEGER, FOREIGN KEY (\"person_id\") REFERENCES \"person\"(\"id\"))", "DROP TABLE \"person-has_age\";", [ [ "term", "person" ], [ "verb", "has age" ] ] ]
		], [
			'T: student',
			[ "term", "student", [] ],
			[ "term", "student", [ [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ] 
		], [
			'	Definition: Value1 or Value2',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ],
		// ], [
			// '	Definition: A person is enrolled in at least one educational institution',
			// 'match failed',
			// 'match failed',
			// 'match failed',
		// ], [
			// '	Definition: person is enrolled in at least one educational institution',
			// 'match failed',
			// 'match failed',
			// 'match failed',
		], [
			'	Definition: person that is enrolled in at least one educational institution',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ]
		], [
			'	Source: A source',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ] 
		], [
			'	Dictionary Basis: A dictionary basis',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ]
		], [
			'	General Concept: A general concept',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ] 	
		], [
			'	Concept Type: person',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ]
		], [
			'	Concept Type: educational institution -- This should fail as we only allow one concept type per term.',
			'match failed',
			'match failed',
			'match failed',
		], [
			'	Necessity: A necessity',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ] 
		], [
			'	Possibility: A possibility',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ]
		], [
			'	Reference Scheme: A reference scheme',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ] 
		], [
			'	Note: A note',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ] 
		], [
			'	Example: An example',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ] 
		], [
			'	Synonym: pupil',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "Synonym", [ "term", "pupil" ] ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "Synonym", [ "term", "pupil" ] ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ] 
		], [
			'	Synonymous Form: This should fail, terms have synonyms instead.',
			'match failed',
			'match failed',
			'match failed',
		], [
			'	See: Something to see',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "Synonym", [ "term", "pupil" ] ], [ "See", "Something to see" ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "Synonym", [ "term", "pupil" ] ], [ "See", "Something to see" ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ]
		], [
			'	Subject Field: A subject field',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "Synonym", [ "term", "pupil" ] ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "Synonym", [ "term", "pupil" ] ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ] 
		], [
			'	Namespace URI: A namespace URI',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "Synonym", [ "term", "pupil" ] ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "Synonym", [ "term", "pupil" ] ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "student" ] ] ],
			[ "term", "student", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student\";" ]
		], [
			'	Database Table Name: student_table',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "Synonym", [ "term", "pupil" ] ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ], [ "DatabaseTableName", "student_table" ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "Synonym", [ "term", "pupil" ] ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ], [ "DatabaseTableName", "student_table" ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ] ] ],
			[ "term", "student_table", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student_table\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student_table\";" ] 
		], [
			'	Database ID Field: id_field',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "Synonym", [ "term", "pupil" ] ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ], [ "DatabaseTableName", "student_table" ], [ "DatabaseIDField", "id_field" ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "Synonym", [ "term", "pupil" ] ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ], [ "DatabaseTableName", "student_table" ], [ "DatabaseIDField", "id_field" ], [ "DatabaseNameField", "name" ] ] ],
			[ "term", "student_table", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student_table\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student_table\";" ]
		], [
			'	Database Name Field: name_field',
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "Synonym", [ "term", "pupil" ] ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ], [ "DatabaseTableName", "student_table" ], [ "DatabaseIDField", "id_field" ], [ "DatabaseNameField", "name_field" ] ] ],
			[ "term", "student", [ [ 'Definition', [ 'Enum', [ 'Value1', 'Value2' ] ] ], [ "Definition", [ "var", [ "num", 0 ], [ "term", "person" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "person" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "ConceptType", [ "term", "person" ] ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "Synonym", [ "term", "pupil" ] ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ], [ "DatabaseTableName", "student_table" ], [ "DatabaseIDField", "id_field" ], [ "DatabaseNameField", "name_field" ] ] ],
			[ "term", "student_table", "student", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"student_table\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"student_table\";" ]
		], [
			'T:\r\n	lecturer\r\n	Concept Type: An ignored attribute', // Check if multiline terms correctly end upon encountering an attribute.
			[ "term", "lecturer", [] ],
			[ "term", "lecturer", [ [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "lecturer" ] ] ],
			[ "term", "lecturer", "lecturer", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"lecturer\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"lecturer\";" ]
		], [
			'	Concept Type: person',
			[ "term", "lecturer", [ [ "ConceptType", [ "term", "person" ] ] ] ],
			[ "term", "lecturer", [ [ "ConceptType", [ "term", "person" ] ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "lecturer" ] ] ],
			[ "term", "lecturer", "lecturer", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"lecturer\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"lecturer\";" ]
		],[
			'	See: A\r multiline\n\r	attribute		Subject Field: An ignored attribute',
			[ "term", "lecturer", [ [ "ConceptType", [ "term", "person" ] ], [ "See", "A\r multiline\n\r	attribute" ] ] ],
			[ "term", "lecturer", [ [ "ConceptType", [ "term", "person" ] ], [ "See", "A\r multiline\n\r	attribute" ], [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "lecturer" ] ] ],
			[ "term", "lecturer", "lecturer", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"lecturer\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"lecturer\";" ]
		], [
			'T: module ',
			[ "term", "module", [] ],
			[ "term", "module", [ [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "module" ] ] ],
			[ "term", "module", "module", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"module\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"module\";" ] 
		], [
			'T: study programme ',
			[ "term", "study programme", [] ],
			[ "term", "study programme", [ [ "DatabaseIDField", "id" ], [ "DatabaseNameField", "name" ], [ "DatabaseTableName", "study_programme" ] ] ],
			[ "term", "study_programme", "study programme", [ [ "Text", "name", "Name", [] ] ], "CREATE TABLE \"study_programme\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT,\"name\" TEXT)", "DROP TABLE \"study_programme\";" ]
		],

		/* Fact Types */
		[
			'F: pupil is enrolled in study programme',
			[ "fcTp", [ "term", "student" ], [ "verb", "is enrolled in" ], [ "term", "study programme" ], [] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is enrolled in" ], [ "term", "study programme" ], [ [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_enrolled_in-study_programme" ] ] ],
			[ "fcTp", "student-is_enrolled_in-study_programme", "student is enrolled in study_programme", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ], [ "ForeignKey", "study_programme_id", "study_programme", [ "study_programme", "id", "name" ] ] ], "CREATE TABLE \"student-is_enrolled_in-study_programme\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, \"study_programme_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"), FOREIGN KEY (\"study_programme_id\") REFERENCES \"study_programme\"(\"id\"))", "DROP TABLE \"student-is_enrolled_in-study_programme\";", [ [ "term", "student" ], [ "verb", "is enrolled in" ], [ "term", "study programme" ] ] ] 
		], [
			'F: module is available for study programme',
			[ "fcTp", [ "term", "module" ], [ "verb", "is available for" ], [ "term", "study programme" ], [] ],
			[ "fcTp", [ "term", "module" ], [ "verb", "is available for" ], [ "term", "study programme" ], [ [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "module-is_available_for-study_programme" ] ] ],
			[ "fcTp", "module-is_available_for-study_programme", "module is available for study_programme", [ [ "ForeignKey", "module_id", "module", [ "module", "id", "name" ] ], [ "ForeignKey", "study_programme_id", "study_programme", [ "study_programme", "id", "name" ] ] ], "CREATE TABLE \"module-is_available_for-study_programme\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"module_id\" INTEGER, \"study_programme_id\" INTEGER, FOREIGN KEY (\"module_id\") REFERENCES \"module\"(\"id\"), FOREIGN KEY (\"study_programme_id\") REFERENCES \"study_programme\"(\"id\"))", "DROP TABLE \"module-is_available_for-study_programme\";", [ [ "term", "module" ], [ "verb", "is available for" ], [ "term", "study programme" ] ] ] 
		], [
			'F: student is school president ',						/* term verb */
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_school_president" ] ] ],
			[ "fcTp", "student-is_school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"student-is_school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"student-is_school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ]
		], [
			'	Definition: An invalid definition',
			'match failed',
			'match failed',
			'match failed'
		], [
			'	Definition: TODO: Fact type definitions',
			'match failed',
			'match failed',
			'match failed'
		], [
			'	Source: A source',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_school_president" ] ] ],
			[ "fcTp", "student-is_school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"student-is_school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"student-is_school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ]
		], [
			'	Dictionary Basis: A dictionary basis',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_school_president" ] ] ],
			[ "fcTp", "student-is_school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"student-is_school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"student-is_school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ]
		], [
			'	General Concept: A general concept',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_school_president" ] ] ],
			[ "fcTp", "student-is_school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"student-is_school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"student-is_school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ] 
		], [
			'	Concept Type: This should fail, concept types are only for terms.',
			'match failed',
			'match failed',
			'match failed'
		], [
			'	Necessity: A necessity',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_school_president" ] ] ],
			[ "fcTp", "student-is_school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"student-is_school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"student-is_school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ]
		], [
			'	Possibility: A possibility',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_school_president" ] ] ],
			[ "fcTp", "student-is_school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"student-is_school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"student-is_school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ]
		], [
			'	Reference Scheme: A reference scheme',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_school_president" ] ] ],
			[ "fcTp", "student-is_school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"student-is_school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"student-is_school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ]
		], [
			'	Note: A note',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_school_president" ] ] ],
			[ "fcTp", "student-is_school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"student-is_school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"student-is_school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ]
		], [
			'	Example: An example',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_school_president" ] ] ],
			[ "fcTp", "student-is_school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"student-is_school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"student-is_school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ] 
		], [
			'	Synonym: This should fail, fact types have synonymous forms instead.',
			'match failed',
			'match failed',
			'match failed'
		], [
			'	Synonymous Form: A synonymous form',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "SynonymousForm", "A synonymous form" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "SynonymousForm", "A synonymous form" ], [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_school_president" ] ] ],
			[ "fcTp", "student-is_school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"student-is_school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"student-is_school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ]
		], [
			'	See: Something to see',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "SynonymousForm", "A synonymous form" ], [ "See", "Something to see" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "SynonymousForm", "A synonymous form" ], [ "See", "Something to see" ], [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_school_president" ] ] ],
			[ "fcTp", "student-is_school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"student-is_school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"student-is_school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ] 
		], [
			'	Subject Field: A subject field',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "SynonymousForm", "A synonymous form" ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "SynonymousForm", "A synonymous form" ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_school_president" ] ] ],
			[ "fcTp", "student-is_school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"student-is_school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"student-is_school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ] 
		], [
			'	Namespace URI: A namespace URI',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "SynonymousForm", "A synonymous form" ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "SynonymousForm", "A synonymous form" ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ], [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_school_president" ] ] ],
			[ "fcTp", "student-is_school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"student-is_school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"student-is_school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ] 
		], [
			'	Database Table Name: school_president',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "SynonymousForm", "A synonymous form" ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ], [ "DatabaseTableName", "school_president" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "SynonymousForm", "A synonymous form" ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ], [ "DatabaseTableName", "school_president" ], [ "DatabaseIDField", "id" ] ] ],
			[ "fcTp", "school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ]
		], [
			'	Database ID Field: id_field',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "SynonymousForm", "A synonymous form" ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ], [ "DatabaseTableName", "school_president" ], [ "DatabaseIDField", "id_field" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "SynonymousForm", "A synonymous form" ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ], [ "DatabaseTableName", "school_president" ], [ "DatabaseIDField", "id_field" ] ] ],
			[ "fcTp", "school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ] 
		], [
			'	Database Name Field: name_field',
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "SynonymousForm", "A synonymous form" ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ], [ "DatabaseTableName", "school_president" ], [ "DatabaseIDField", "id_field" ], [ "DatabaseNameField", "name_field" ] ] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is school president" ], [ [ "Source", "A source" ], [ "DictionaryBasis", "A dictionary basis" ], [ "GeneralConcept", "A general concept" ], [ "Necessity", "A necessity" ], [ "Possibility", "A possibility" ], [ "ReferenceScheme", "A reference scheme" ], [ "Note", "A note" ], [ "Example", "An example" ], [ "SynonymousForm", "A synonymous form" ], [ "See", "Something to see" ], [ "SubjectField", "A subject field" ], [ "NamespaceURI", "A namespace URI" ], [ "DatabaseTableName", "school_president" ], [ "DatabaseIDField", "id_field" ], [ "DatabaseNameField", "name_field" ] ] ],
			[ "fcTp", "school_president", "student is school president", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ] ], "CREATE TABLE \"school_president\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"))", "DROP TABLE \"school_president\";", [ [ "term", "student" ], [ "verb", "is school president" ] ] ] 
		], [
			'F: student is registered for module',					/* term verb term */ 
			[ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ], [] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ], [ [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_registered_for-module" ] ] ],
			[ "fcTp", "student-is_registered_for-module", "student is registered for module", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ], [ "ForeignKey", "module_id", "module", [ "module", "id", "name" ] ] ], "CREATE TABLE \"student-is_registered_for-module\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, \"module_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"), FOREIGN KEY (\"module_id\") REFERENCES \"module\"(\"id\"))", "DROP TABLE \"student-is_registered_for-module\";", [ [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ] ]
		], [
			'F: student is registered for module to catchup',		/* term verb term verb */ 
			[ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ], [ "verb", "to catchup" ], [] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ], [ "verb", "to catchup" ], [ [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_registered_for-module-to_catchup" ] ] ],
			[ "fcTp", "student-is_registered_for-module-to_catchup", "student is registered for module to catchup", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ], [ "ForeignKey", "module_id", "module", [ "module", "id", "name" ] ] ], "CREATE TABLE \"student-is_registered_for-module-to_catchup\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, \"module_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"), FOREIGN KEY (\"module_id\") REFERENCES \"module\"(\"id\"))", "DROP TABLE \"student-is_registered_for-module-to_catchup\";", [ [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ], [ "verb", "to catchup" ] ] ]
		], [
			'F: student is registered for module with lecturer',	/* term verb term verb term */ 
			[ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ], [ "verb", "with" ], [ "term", "lecturer" ], [] ],
			[ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ], [ "verb", "with" ], [ "term", "lecturer" ], [ [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "student-is_registered_for-module-with-lecturer" ] ] ],
			[ "fcTp", "student-is_registered_for-module-with-lecturer", "student is registered for module with lecturer", [ [ "ForeignKey", "student_table_id", "student_table", [ "student_table", "id", "name" ] ], [ "ForeignKey", "module_id", "module", [ "module", "id", "name" ] ], [ "ForeignKey", "lecturer_id", "lecturer", [ "lecturer", "id", "name" ] ] ], "CREATE TABLE \"student-is_registered_for-module-with-lecturer\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"student_table_id\" INTEGER, \"module_id\" INTEGER, \"lecturer_id\" INTEGER, FOREIGN KEY (\"student_table_id\") REFERENCES \"student_table\"(\"id\"), FOREIGN KEY (\"module_id\") REFERENCES \"module\"(\"id\"), FOREIGN KEY (\"lecturer_id\") REFERENCES \"lecturer\"(\"id\"))", "DROP TABLE \"student-is_registered_for-module-with-lecturer\";", [ [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ], [ "verb", "with" ], [ "term", "lecturer" ] ] ] 
		], [
			'F: person is swimming',								/* for inflection */
			[ "fcTp", [ "term", "person" ], [ "verb", "is swimming" ], [] ],
			[ "fcTp", [ "term", "person" ], [ "verb", "is swimming" ], [ [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "person-is_swimming" ] ] ],
			[ "fcTp", "person-is_swimming", "person is swimming", [ [ "ForeignKey", "person_id", "person", [ "person", "id", "name" ] ] ], "CREATE TABLE \"person-is_swimming\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"person_id\" INTEGER, FOREIGN KEY (\"person_id\") REFERENCES \"person\"(\"id\"))", "DROP TABLE \"person-is_swimming\";", [ [ "term", "person" ], [ "verb", "is swimming" ] ] ]
		], [
			'F: lecturer is\n teacher\r of module \r\nR: An ignored rule',
			[ "fcTp", [ "term", "lecturer" ], [ "verb", "is teacher of" ], [ "term", "module" ], [] ],
			[ "fcTp", [ "term", "lecturer" ], [ "verb", "is teacher of" ], [ "term", "module" ], [ [ "DatabaseIDField", "id" ], [ "DatabaseTableName", "lecturer-is_teacher_of-module" ] ] ],
			[ "fcTp", "lecturer-is_teacher_of-module", "lecturer is teacher of module", [ [ "ForeignKey", "lecturer_id", "lecturer", [ "lecturer", "id", "name" ] ], [ "ForeignKey", "module_id", "module", [ "module", "id", "name" ] ] ], "CREATE TABLE \"lecturer-is_teacher_of-module\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"lecturer_id\" INTEGER, \"module_id\" INTEGER, FOREIGN KEY (\"lecturer_id\") REFERENCES \"lecturer\"(\"id\"), FOREIGN KEY (\"module_id\") REFERENCES \"module\"(\"id\"))", "DROP TABLE \"lecturer-is_teacher_of-module\";", [ [ "term", "lecturer" ], [ "verb", "is teacher of" ], [ "term", "module" ] ] ]
		],

		/* Mod rules */
		[
			'R: It is obligatory that	a student is school president',			/* It is obligatory */ 
			[ "rule", [ "obl", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ], [ "text", "It is obligatory that	a student is school president" ] ],
			[ "rule", [ "obl", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ], [ "text", "It is obligatory that	a student is school president" ] ],
			[ "rule", [], "It is obligatory that	a student is school president", [], "SELECT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE EXISTS(SELECT * FROM \"school_president\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\")) AS \"result\"", [] ]
		], [
			'R: It is necessary that	a student is school president',			/* It is necessary */ 
			[ "rule", [ "nec", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ], [ "text", "It is necessary that	a student is school president" ] ],
			[ "rule", [ "nec", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ], [ "text", "It is necessary that	a student is school president" ] ],
			[ "rule", [], "It is necessary that	a student is school president", [], "SELECT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE EXISTS(SELECT * FROM \"school_president\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\")) AS \"result\"", [] ]
		], [
			'R: It is possible that		a student is school president',			/* It is possible */ 
			[ "rule", [ "pos", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ], [ "text", "It is possible that		a student is school president" ] ],
			[ "rule", [ "pos", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ], [ "text", "It is possible that		a student is school president" ] ],
			[ "rule", [], "It is possible that		a student is school president", [], "SELECT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE EXISTS(SELECT * FROM \"school_president\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\")) AS \"result\"", [] ] 
		], [
			'R: It is permissible that	a student is school president',			/* It is permissible */ 
			[ "rule", [ "prm", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ], [ "text", "It is permissible that	a student is school president" ] ],
			[ "rule", [ "prm", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ], [ "text", "It is permissible that	a student is school president" ] ],
			[ "rule", [], "It is permissible that	a student is school president", [], "SELECT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE EXISTS(SELECT * FROM \"school_president\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\")) AS \"result\"", [] ]
		], [
			'R: It is prohibited that	some students are school president',	/* It is prohibited */ 
			[ "rule", [ "obl", [ "neg", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ] ], [ "text", "It is prohibited that	some students are school president" ] ],
			[ "rule", [ "obl", [ "neg", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ] ], [ "text", "It is prohibited that	some students are school president" ] ],
			[ "rule", [], "It is prohibited that	some students are school president", [], "SELECT NOT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE EXISTS(SELECT * FROM \"school_president\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\")) AS \"result\"", [] ]
		], [
			'R: It is impossible that	some students are school president',	/* It is impossible */ 
			[ "rule", [ "nec", [ "neg", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ] ], [ "text", "It is impossible that	some students are school president" ] ],
			[ "rule", [ "nec", [ "neg", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ] ], [ "text", "It is impossible that	some students are school president" ] ],
			[ "rule", [], "It is impossible that	some students are school president", [], "SELECT NOT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE EXISTS(SELECT * FROM \"school_president\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\")) AS \"result\"", [] ]
		], [
			'R: It is not possible that	some students are school president',	/* It is not possible */
			[ "rule", [ "nec", [ "neg", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ] ], [ "text", "It is not possible that	some students are school president" ] ],
			[ "rule", [ "nec", [ "neg", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ] ], [ "text", "It is not possible that	some students are school president" ] ],
			[ "rule", [], "It is not possible that	some students are school president", [], "SELECT NOT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE EXISTS(SELECT * FROM \"school_president\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\")) AS \"result\"", [] ]
		],
		
		/* Quantifiers */
		[
			'R: It is obligatory that each	student		is registered for at least one module',		/* each */ 
			[ "rule", [ "obl", [ "univQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that each	student		is registered for at least one module" ] ],
			[ "rule", [ "obl", [ "neg", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "neg", [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ] ] ], [ "text", "It is obligatory that each	student		is registered for at least one module" ] ],
			[ "rule", [], "It is obligatory that each	student		is registered for at least one module", [], "SELECT NOT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE NOT EXISTS(SELECT * FROM \"module\" AS \"var1\" WHERE EXISTS(SELECT * FROM \"student-is_registered_for-module\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\" AND \"var1\".\"id\" = \"f\".\"module_id\"))) AS \"result\"", [] ]
		], [
			'R: It is obligatory that a		student		is registered for at least one module',	/* a */ 
			[ "rule", [ "obl", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that a		student		is registered for at least one module" ] ],
			[ "rule", [ "obl", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that a		student		is registered for at least one module" ] ],
			[ "rule", [], "It is obligatory that a		student		is registered for at least one module", [], "SELECT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE 1=1) AS \"result\"", [] ]
		], [
			'R: It is obligatory that an	student		is registered for at least one module',	/* an */ 
			[ "rule", [ "obl", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that an	student		is registered for at least one module" ] ],
			[ "rule", [ "obl", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that an	student		is registered for at least one module" ] ],
			[ "rule", [], "It is obligatory that an	student		is registered for at least one module", [], "SELECT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE 1=1) AS \"result\"", [] ]	
		], [
			'R: It is obligatory that some	students	are registered for at least one module',	/* some */
			[ "rule", [ "obl", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that some	students	are registered for at least one module" ] ],
			[ "rule", [ "obl", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that some	students	are registered for at least one module" ] ],
			[ "rule", [], "It is obligatory that some	students	are registered for at least one module", [], "SELECT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE 1=1) AS \"result\"", [] ] 
		],
		
		/* Quantifiers with cardinality */
		[
			'R: It is obligatory that at most 50	students are registered for at least one module',	/* at most */ 
			[ "rule", [ "obl", [ "atMostQ", [ "maxCard", [ "num", 50 ] ], [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that at most 50	students are registered for at least one module" ] ],
			[ "rule", [ "obl", [ "neg", [ "atLeastQ", [ "minCard", [ "num", 51 ] ], [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ] ], [ "text", "It is obligatory that at most 50	students are registered for at least one module" ] ],
			[ "rule", [], "It is obligatory that at most 50	students are registered for at least one module", [], "SELECT NOT EXISTS(SELECT count(*) AS \"card\" FROM \"student_table\" AS \"var0\" JOIN \"module\" AS \"var1\" ON EXISTS(SELECT * FROM \"student-is_registered_for-module\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\" AND \"var1\".\"id\" = \"f\".\"module_id\") WHERE 1=1 GROUP BY NULL HAVING count(*)>=51) AS \"result\"", [] ]
		], [
			'R: It is obligatory that at least one	student is registered for at least one module',		/* at least */ 
			[ "rule", [ "obl", [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that at least one	student is registered for at least one module" ] ],
			[ "rule", [ "obl", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that at least one	student is registered for at least one module" ] ],
			[ "rule", [], "It is obligatory that at least one	student is registered for at least one module", [], "SELECT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE 1=1) AS \"result\"", [] ]
		], [
			'R: It is obligatory that more than 0	students are registered for at least one module',	/* more than */ 
			[ "rule", [ "obl", [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that more than 0	students are registered for at least one module" ] ],
			[ "rule", [ "obl", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that more than 0	students are registered for at least one module" ] ],
					[ "rule", [], "It is obligatory that more than 0	students are registered for at least one module", [], "SELECT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE 1=1) AS \"result\"", [] ] 
		], [
			'R: It is obligatory that exactly one	student is school president',						/* exactly */
			[ "rule", [ "obl", [ "exactQ", [ "card", [ "num", 1 ] ], [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ], [ "text", "It is obligatory that exactly one	student is school president" ] ],
			[ "rule", [ "obl", [ "exactQ", [ "card", [ "num", 1 ] ], [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ], [ "text", "It is obligatory that exactly one	student is school president" ] ],
			[ "rule", [], "It is obligatory that exactly one	student is school president", [], "SELECT EXISTS(SELECT count(*) AS \"card\" FROM \"student_table\" AS \"var0\" WHERE EXISTS(SELECT * FROM \"school_president\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\") GROUP BY NULL HAVING count(*)=1) AS \"result\"", [] ] 
		],
		
		/* Quantifiers with dual cardinality */
		[
			'R: It is obligatory that at least one and at most 50	students are registered for at least one module',	/* at least */
			[ "rule", [ "obl", [ "numRngQ", [ "minCard", [ "num", 1 ] ], [ "maxCard", [ "num", 50 ] ], [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that at least one and at most 50	students are registered for at least one module" ] ],
			[ "rule", [ "obl", [ "numRngQ", [ "minCard", [ "num", 1 ] ], [ "maxCard", [ "num", 50 ] ], [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that at least one and at most 50	students are registered for at least one module" ] ],
			[ "rule", [], "It is obligatory that at least one and at most 50	students are registered for at least one module", [], "SELECT EXISTS(SELECT count(*) AS \"card\" FROM \"student_table\" AS \"var0\" JOIN \"module\" AS \"var1\" ON EXISTS(SELECT * FROM \"student-is_registered_for-module\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\" AND \"var1\".\"id\" = \"f\".\"module_id\") WHERE 1=1 GROUP BY NULL HAVING count(*)>=1 AND \"card\"<=50) AS \"result\"", [] ] 
		],
		
		/* Rule with n-ary fact type */
		[
			'R: It is obligatory that a student is registered for a module with a lecturer',
			[ "rule", [ "obl", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "existQ", [ "var", [ "num", 2 ], [ "term", "lecturer" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ], [ "verb", "with" ], [ "term", "lecturer" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ], [ "bind", [ "term", "lecturer" ], 2 ] ] ] ] ] ], [ "text", "It is obligatory that a student is registered for a module with a lecturer" ] ],
			[ "rule", [ "obl", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "existQ", [ "var", [ "num", 2 ], [ "term", "lecturer" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ], [ "verb", "with" ], [ "term", "lecturer" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ], [ "bind", [ "term", "lecturer" ], 2 ] ] ] ] ] ], [ "text", "It is obligatory that a student is registered for a module with a lecturer" ] ],
			[ "rule", [], "It is obligatory that a student is registered for a module with a lecturer", [], "SELECT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE 1=1) AS \"result\"", [] ] 
		],
		
		/* Rule with thats */
		[
			'R: It is obligatory that a student that is registered for a module that is available for a study programme is enrolled in a study programme that the module is available for',
			[ "rule", [ "obl", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ], [ "existQ", [ "var", [ "num", 2 ], [ "term", "study programme" ] ], [ "aFrm", [ "fcTp", [ "term", "module" ], [ "verb", "is available for" ], [ "term", "study programme" ] ], [ "bind", [ "term", "module" ], 1 ], [ "bind", [ "term", "study programme" ], 2 ] ] ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ], [ "existQ", [ "var", [ "num", 3 ], [ "term", "study programme" ], [ "aFrm", [ "fcTp", [ "term", "module" ], [ "verb", "is available for" ], [ "term", "study programme" ] ], [ "bind", [ "term", "module" ], 1 ], [ "bind", [ "term", "study programme" ], 3 ] ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is enrolled in" ], [ "term", "study programme" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "study programme" ], 3 ] ] ] ] ], [ "text", "It is obligatory that a student that is registered for a module that is available for a study programme is enrolled in a study programme that the module is available for" ] ],
			[ "rule", [ "obl", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ], [ "existQ", [ "var", [ "num", 2 ], [ "term", "study programme" ] ], [ "aFrm", [ "fcTp", [ "term", "module" ], [ "verb", "is available for" ], [ "term", "study programme" ] ], [ "bind", [ "term", "module" ], 1 ], [ "bind", [ "term", "study programme" ], 2 ] ] ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ], [ "existQ", [ "var", [ "num", 3 ], [ "term", "study programme" ], [ "aFrm", [ "fcTp", [ "term", "module" ], [ "verb", "is available for" ], [ "term", "study programme" ] ], [ "bind", [ "term", "module" ], 1 ], [ "bind", [ "term", "study programme" ], 3 ] ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is enrolled in" ], [ "term", "study programme" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "study programme" ], 3 ] ] ] ] ], [ "text", "It is obligatory that a student that is registered for a module that is available for a study programme is enrolled in a study programme that the module is available for"] ],
			[ "rule", [], "It is obligatory that a student that is registered for a module that is available for a study programme is enrolled in a study programme that the module is available for", [], "SELECT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE 1=1 AND 1=1) AS \"result\"", [] ]
		],
		
		/* Rule ending within verb */
		[
			'R: It is obligatory that each student that is registered for a module is enrolled in a study programme that the module is available for',
			[ "rule", [ "obl", [ "univQ", [ "var", [ "num", 0 ], [ "term", "student" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ], [ "existQ", [ "var", [ "num", 2 ], [ "term", "study programme" ], [ "aFrm", [ "fcTp", [ "term", "module" ], [ "verb", "is available for" ], [ "term", "study programme" ] ], [ "bind", [ "term", "module" ], 1 ], [ "bind", [ "term", "study programme" ], 2 ] ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is enrolled in" ], [ "term", "study programme" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "study programme" ], 2 ] ] ] ] ], [ "text", "It is obligatory that each student that is registered for a module is enrolled in a study programme that the module is available for" ] ],
			[ "rule", [ "obl", [ "neg", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ], [ "neg", [ "existQ", [ "var", [ "num", 2 ], [ "term", "study programme" ], [ "aFrm", [ "fcTp", [ "term", "module" ], [ "verb", "is available for" ], [ "term", "study programme" ] ], [ "bind", [ "term", "module" ], 1 ], [ "bind", [ "term", "study programme" ], 2 ] ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is enrolled in" ], [ "term", "study programme" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "study programme" ], 2 ] ] ] ] ] ] ], [ "text", "It is obligatory that each student that is registered for a module is enrolled in a study programme that the module is available for" ] ],
			[ "rule", [], "It is obligatory that each student that is registered for a module is enrolled in a study programme that the module is available for", [], "SELECT NOT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" JOIN \"module\" AS \"var1\" ON EXISTS(SELECT * FROM \"student-is_registered_for-module\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\" AND \"var1\".\"id\" = \"f\".\"module_id\") WHERE 1=1 AND NOT EXISTS(SELECT * FROM \"study_programme\" AS \"var2\" WHERE EXISTS(SELECT * FROM \"module-is_available_for-study_programme\" AS \"f\" WHERE \"var1\".\"id\" = \"f\".\"module_id\" AND \"var2\".\"id\" = \"f\".\"study_programme_id\" AND EXISTS(SELECT * FROM \"student-is_enrolled_in-study_programme\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\" AND \"var2\".\"id\" = \"f\".\"study_programme_id\")))) AS \"result\"", [] ] 

		],
		
		/* Inflection */
		[
			'R: It is obligatory that exactly 0 people are swimming',
			[ "rule", [ "obl", [ "exactQ", [ "card", [ "num", 0 ] ], [ "var", [ "num", 0 ], [ "term", "person" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is swimming" ] ], [ "bind", [ "term", "person" ], 0 ] ] ] ], [ "text", "It is obligatory that exactly 0 people are swimming" ] ],
			[ "rule", [ "obl", [ "exactQ", [ "card", [ "num", 0 ] ], [ "var", [ "num", 0 ], [ "term", "person" ] ], [ "aFrm", [ "fcTp", [ "term", "person" ], [ "verb", "is swimming" ] ], [ "bind", [ "term", "person" ], 0 ] ] ] ], [ "text", "It is obligatory that exactly 0 people are swimming" ] ],
			[ "rule", [], "It is obligatory that exactly 0 people are swimming", [], "SELECT EXISTS(SELECT count(*) AS \"card\" FROM \"person\" AS \"var0\" WHERE EXISTS(SELECT * FROM \"person-is_swimming\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"person_id\") GROUP BY NULL HAVING count(*)=0) AS \"result\"", [] ]
		],
		
		/* Term-Verb Linking */
		[
			'R: It is obligatory that exactly 0 people are school president',
			'match failed',
			'match failed',
			'match failed'
		],[
			'R: It is obligatory that each student is available for a module',
			'match failed',
			'match failed',
			'match failed'
		],[
			'R: It is obligatory that each student is registered for a study programme',
			'match failed',
			'match failed',
			'match failed'
		],[
			'R: It is obligatory that each student is registered for a module is available for a study programme',
			'match failed',
			'match failed',
			'match failed'
		],
		/* Ending on a that */
		[
			'R: It is obligatory that each student is registered for a module that is available for a study programme',
			[ "rule", [ "obl", [ "univQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ], [ "existQ", [ "var", [ "num", 2 ], [ "term", "study programme" ] ], [ "aFrm", [ "fcTp", [ "term", "module" ], [ "verb", "is available for" ], [ "term", "study programme" ] ], [ "bind", [ "term", "module" ], 1 ], [ "bind", [ "term", "study programme" ], 2 ] ] ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that each student is registered for a module that is available for a study programme" ] ],
			[ "rule", [ "obl", [ "neg", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "neg", [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ], [ "existQ", [ "var", [ "num", 2 ], [ "term", "study programme" ] ], [ "aFrm", [ "fcTp", [ "term", "module" ], [ "verb", "is available for" ], [ "term", "study programme" ] ], [ "bind", [ "term", "module" ], 1 ], [ "bind", [ "term", "study programme" ], 2 ] ] ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ] ] ], [ "text", "It is obligatory that each student is registered for a module that is available for a study programme" ] ],
			[ "rule", [], "It is obligatory that each student is registered for a module that is available for a study programme", [], "SELECT NOT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE NOT EXISTS(SELECT * FROM \"module\" AS \"var1\" JOIN \"study_programme\" AS \"var2\" ON EXISTS(SELECT * FROM \"module-is_available_for-study_programme\" AS \"f\" WHERE \"var1\".\"id\" = \"f\".\"module_id\" AND \"var2\".\"id\" = \"f\".\"study_programme_id\") WHERE 1=1 AND EXISTS(SELECT * FROM \"student-is_registered_for-module\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\" AND \"var1\".\"id\" = \"f\".\"module_id\"))) AS \"result\"", [] ]
		],
		/* term that verb, verb.. */
		[
			'R: It is obligatory that each student that is school president, is registered for at least 8 modules',
			[ "rule", [ "obl", [ "univQ", [ "var", [ "num", 0 ], [ "term", "student" ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ], [ "atLeastQ", [ "minCard", [ "num", 8 ] ], [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It is obligatory that each student that is school president, is registered for at least 8 modules" ] ],
			[ "rule", [ "obl", [ "neg", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is school president" ] ], [ "bind", [ "term", "student" ], 0 ] ] ], [ "neg", [ "atLeastQ", [ "minCard", [ "num", 8 ] ], [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ] ] ], [ "text", "It is obligatory that each student that is school president, is registered for at least 8 modules" ] ],
			[ "rule", [], "It is obligatory that each student that is school president, is registered for at least 8 modules", [], "SELECT NOT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE EXISTS(SELECT * FROM \"school_president\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\" AND NOT EXISTS(SELECT count(*) AS \"card\" FROM \"module\" AS \"var1\" WHERE EXISTS(SELECT * FROM \"student-is_registered_for-module\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\" AND \"var1\".\"id\" = \"f\".\"module_id\") GROUP BY NULL HAVING count(*)>=8))) AS \"result\"", [] ]
		],
		/* Concept type */
		[
			'R: It is obligatory that each student has age',
			[ "rule", [ "obl", [ "univQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "has age" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ], [ "text", "It is obligatory that each student has age" ] ],
			[ "rule", [ "obl", [ "neg", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "neg", [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "has age" ] ], [ "bind", [ "term", "student" ], 0 ] ] ] ] ] ], [ "text", "It is obligatory that each student has age" ] ],
			[ "rule", [], "It is obligatory that each student that is school president is registered for at least 8 modules", [], "SELECT NOT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE EXISTS(SELECT * FROM \"school_president\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\" AND NOT EXISTS(SELECT count(*) AS \"card\" FROM \"module\" AS \"var1\" WHERE EXISTS(SELECT * FROM \"student-is_registered_for-module\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\" AND \"var1\".\"id\" = \"f\".\"module_id\") GROUP BY NULL HAVING count(*)>=8))) AS \"result\"", [] ]
		],
		[
			'R: It is obligatory that each student is enrolled in an educational institution',
			[ "rule", [ "obl", [ "univQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ], [ "text", "It is obligatory that each student is enrolled in an educational institution" ] ],
			[ "rule", [ "obl", [ "neg", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "neg", [ "existQ", [ "var", [ "num", 1 ], [ "term", "educational institution" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is enrolled in" ], [ "term", "educational institution" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "educational institution" ], 1 ] ] ] ] ] ] ], [ "text", "It is obligatory that each student is enrolled in an educational institution" ] ],
			[ "rule", [], "It is obligatory that each student that is school president is registered for at least 8 modules", [], "SELECT NOT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE EXISTS(SELECT * FROM \"school_president\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\" AND NOT EXISTS(SELECT count(*) AS \"card\" FROM \"module\" AS \"var1\" WHERE EXISTS(SELECT * FROM \"student-is_registered_for-module\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\" AND \"var1\".\"id\" = \"f\".\"module_id\") GROUP BY NULL HAVING count(*)>=8))) AS \"result\"", [] ]
		],
		
		/* New lines */
		[
			'R:	\rIt\r\n is	 \robligatory \nthat\n each\r	student	\n\r	is\n registered\r\n for \n at\r least\n\r one\r module\r\n	R: An ignored rule',
			[ "rule", [ "obl", [ "univQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "atLeastQ", [ "minCard", [ "num", 1 ] ], [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ], [ "text", "It\r\n is	 \robligatory \nthat\n each\r	student	\n\r	is\n registered\r\n for \n at\r least\n\r one\r module" ] ],
			[ "rule", [ "obl", [ "neg", [ "existQ", [ "var", [ "num", 0 ], [ "term", "student" ] ], [ "neg", [ "existQ", [ "var", [ "num", 1 ], [ "term", "module" ] ], [ "aFrm", [ "fcTp", [ "term", "student" ], [ "verb", "is registered for" ], [ "term", "module" ] ], [ "bind", [ "term", "student" ], 0 ], [ "bind", [ "term", "module" ], 1 ] ] ] ] ] ] ], [ "text", "It\r\n is	 \robligatory \nthat\n each\r	student	\n\r	is\n registered\r\n for \n at\r least\n\r one\r module" ] ],
			[ "rule", [], "It\r\n is	 \robligatory \nthat\n each\r	student	\n\r	is\n registered\r\n for \n at\r least\n\r one\r module", [], "SELECT NOT EXISTS(SELECT * FROM \"student_table\" AS \"var0\" WHERE NOT EXISTS(SELECT * FROM \"module\" AS \"var1\" WHERE EXISTS(SELECT * FROM \"student-is_registered_for-module\" AS \"f\" WHERE \"var0\".\"id\" = \"f\".\"student_table_id\" AND \"var1\".\"id\" = \"f\".\"module_id\"))) AS \"result\"", [] ]
		]
	];


	module("SBVR tests");

	test("SBVRParser",function() {
		expect(testModel.length);
		var parser = SBVRParser.createInstance();
		for(var i=0,l=testModel.length;i<l;i++) {
			try {
				deepEqual(parser.matchAll(testModel[i][0],'line'), testModel[i][1], testModel[i][0]);
			}
			catch(e) {
				console.log(e);
				equal(e.toString(), testModel[i][1], testModel[i][0]);
			}
		}
	})

	test("LF2AbstractSQLPrep",function() {
		expect(testModel.length);
		for(var i=0,l=testModel.length;i<l;i++) {
			try {
				deepEqual(LF2AbstractSQLPrep.match(['model',testModel[i][1]],'Process'), ['model',testModel[i][2]], testModel[i][0]);
			}
			catch(e) {
				console.log(e);
				equal(e.toString(), testModel[i][2], testModel[i][0]);
			}
		}
	})

	test("SBVR2SQL",function() {
		expect(testModel.length);
		var parser = SBVR2SQL.createInstance();
		for(var i=0,l=testModel.length;i<l;i++) {
			try {
				deepEqual(parser.match(['model',testModel[i][2]],'trans'), ['model',testModel[i][3]], testModel[i][0]);
			}
			catch(e) {
				console.log(e);
				equal(e.toString(), testModel[i][3], testModel[i][0]);
			}
		}
	})
});