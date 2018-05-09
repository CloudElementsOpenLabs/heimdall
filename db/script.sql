CREATE SEQUENCE application_id_seq;

CREATE TABLE application(
    id BIGINT NOT NULL DEFAULT nextval('application_id_seq'),
    org_secret VARCHAR(128) NOT NULL,
    created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    updated_date TIMESTAMP WITHOUT TIME ZONE,
    constraint application_pk primary key (id)
);

ALTER TABLE application ADD CONSTRAINT application_org_secret UNIQUE (org_secret);

CREATE SEQUENCE element_id_seq;

CREATE TABLE element(
    id BIGINT NOT NULL DEFAULT nextval('element_id_seq'),
    application_id BIGINT NOT NULL,
    key VARCHAR(256) NOT NULL,
    name VARCHAR(256) NOT NULL,
    auth_type VARCHAR(32) NOT NULL,
    cookie_auth BOOLEAN DEFAULT FALSE,
    created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    updated_date TIMESTAMP WITHOUT TIME ZONE,
    constraint element_pk primary key (id)
);

ALTER TABLE element add constraint element_application_id_fk
foreign key (application_id)
references application(id);

CREATE SEQUENCE element_property_id_seq;

CREATE TABLE element_property(
    id BIGINT NOT NULL DEFAULT nextval('element_property_id_seq'),
    element_id BIGINT NOT NULL,
    data_type VARCHAR(32) NOT NULL,
    description VARCHAR(1024),
    display_name VARCHAR(256),
    display BOOLEAN DEFAULT FALSE,
    key VARCHAR(256),
    default_value VARCHAR,
    oauth_url_param VARCHAR(64),
    created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    updated_date TIMESTAMP WITHOUT TIME ZONE,
    constraint element_property_pk primary key (id)
);

ALTER TABLE element_property add constraint element_property_element_id_fk
foreign key (element_id)
references element(id);

CREATE SEQUENCE picklist_option_id_seq;

CREATE TABLE picklist_option(
    id BIGINT NOT NULL DEFAULT nextval('picklist_option_id_seq'),
    element_property_id BIGINT NOT NULL,
    display VARCHAR(256) NOT NULL,
    value VARCHAR(256) NOT NULL,
    created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    updated_date TIMESTAMP WITHOUT TIME ZONE,
    constraint picklist_option_pk primary key (id)
);

ALTER TABLE picklist_option add constraint picklist_option_element_property_id_fk
foreign key (element_property_id)
references element_property(id);

ALTER TABLE application ADD COLUMN css_url VARCHAR(1000),
ADD COLUMN help_url VARCHAR(1000),
ADD COLUMN logo_url VARCHAR(1000)
